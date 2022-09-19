import { makeAutoObservable } from 'mobx'
import { injectable } from 'tsyringe'

import { GlobalModel } from '@/context/app'
import { Namespace } from '@/models'
import { ColumnUtils, Common } from '@/services'
import { filterEmpty } from '@/knife'

import Service from './services'

import type { Chart, Common as CommonType, Component, Global } from '@/types'

@injectable()
export default class Model {
	parent = 'Page' as Component.StackComponent['parent']
	model = '' as Component.StackComponent['model']
	setting = {} as Chart.Setting
	data = {} as Global.AnyObject
	filter_columns = [] as Array<CommonType.Column>
	chart_columns = [] as Array<Chart.Column>
	search_params = {} as Global.StringObject
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
		const { res, err } = await this.common.getSetting<Chart.Setting>('chart', this.model)

		if (err) return

		this.rendered = true
		this.setting = res

		this.chart_columns = this.column_utils.reduceAny(res.chart.columns, res.fileds.chart)

		if (res.filter && res.fileds.filter) {
			this.filter_columns = this.column_utils.reduce(
				res.filter.columns,
				res.fileds.filter
			)
		}
	}

	async search(params?: Global.StringObject) {
		if (this.parent === 'Page' && this.rendered === false) this.global.loading = true

		this.search_params = filterEmpty(params)

		const { res, err } = await this.service.search<Global.StringObject, Global.AnyObject>(
			this.model,
			this.search_params
		)

		this.global.loading = false

		if (err) return

		this.data = res
	}

	init(parent: Component.StackComponent['parent'], model: Component.StackComponent['model']) {
		this.parent = parent
		this.model = model

		this.getSetting()
		this.search()
	}

	resetSearchParams() {
		this.search_params = {}
	}
}
