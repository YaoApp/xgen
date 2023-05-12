import { makeAutoObservable, toJS } from 'mobx'
import { injectable } from 'tsyringe'

import { GlobalModel } from '@/context/app'
import { Namespace } from '@/models'
import { ColumnUtils, Common } from '@/services'

import Service from './services'

import type { Dashboard, Component, Global } from '@/types'

@injectable()
export default class Model {
	parent = 'Page' as Component.StackComponent['parent']
	model = '' as Component.StackComponent['model']
	setting = {} as Dashboard.Setting
	data = {} as Global.AnyObject
	columns = [] as Array<Dashboard.TargetColumn>
	rendered = false

	constructor(
		private service: Service,
		private common: Common,
		private column_utils: ColumnUtils,
		public global: GlobalModel,
		public namespace: Namespace
	) {
		makeAutoObservable(this, {}, { autoBind: true })
	}

	async getSetting() {
		const { res, err } = await this.common.getSetting<Dashboard.Setting>('dashboard', this.model)

		if (err) return

		this.rendered = true
		this.setting = res

		this.columns = this.column_utils.reduceDashboardColumns(res.dashboard.columns, res.fields.dashboard)
	}

	async search() {
		if (this.parent === 'Page' && this.rendered === false) this.global.loading = true

		const { res, err } = await this.service.search<Global.AnyObject>(this.model)

		this.global.loading = false

		if (err) return Promise.reject()

		this.data = res

		return Promise.resolve()
	}

	init(parent: Component.StackComponent['parent'], model: Component.StackComponent['model']) {
		this.setting = {} as Dashboard.Setting
		this.data = {} as Global.AnyObject

		this.global.stack.push(`Dashboard-${parent}-${model}`)

		this.namespace.paths = toJS(this.global.stack.paths)
		this.parent = parent
		this.model = model

		this.getSetting()
		this.search()
		this.on()
      }
      
      refetch() {
		this.getSetting()
		this.search()
	}

	on() {
		window.$app.Event.on(`${this.namespace.value}/search`, this.search)
		window.$app.Event.on(`${this.namespace.value}/refetch`, this.refetch)
	}

	off() {
		window.$app.Event.off(`${this.namespace.value}/search`, this.search)
		window.$app.Event.off(`${this.namespace.value}/refetch`, this.refetch)
	}
}
