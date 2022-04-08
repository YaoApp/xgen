import { message } from 'antd'
import { makeAutoObservable } from 'mobx'
import { injectable } from 'tsyringe'

import { GlobalModel } from '@/context/app'
import { Namespace } from '@/models'
import { Common, Table, Utils } from '@/services'

import Service from './services'

import type { FormType, TableType, Component } from '@/types'

@injectable()
export default class Model {
	parent = 'Page' as Component.StackComponent['parent']
	model = '' as Component.StackComponent['model']
	id = 0
	setting = {} as FormType.Setting
	sections = [] as Array<any>

	constructor(
		private service: Service,
		private common: Common,
		private table: Table,
		private utils: Utils,
		public global: GlobalModel,
		public namespace: Namespace
	) {
		makeAutoObservable(this, {}, { autoBind: true })
	}

	async getSetting() {
		const { res, err } = await this.common.getSetting<FormType.Setting>('form', this.model)

		if (err) return

		this.setting = res
		this.sections = this.utils.reduceSections(res.form.sections, res.fileds.form)
	}

	async find(params?: any) {
		const { res, err } = await this.service.find<any, {}>(this.model, params)
	}

	async save(data: TableType.SaveRequest) {
		const hideLoading = message.loading(
			this.global.locale_messages.messages.table.save.loading
		)

		const { err } = await this.table.save<TableType.SaveRequest, TableType.SaveResponse>(
			this.model,
			data
		)

		hideLoading()

		if (err) return

		message.success(this.global.locale_messages.messages.table.save.success)
	}

	async delete(primary_value: number) {
		const hideLoading = message.loading(
			this.global.locale_messages.messages.table.delete.loading
		)

		const { err } = await this.table.delete<TableType.DeleteResponse>(
			this.model,
			primary_value
		)

		hideLoading()

		if (err) return

		message.success(this.global.locale_messages.messages.table.delete.success)
	}

	init(parent: Component.StackComponent['parent'], model: Component.StackComponent['model']) {
		this.global.stack.push(`FormType-${parent}-${model}`)

		this.namespace.paths = this.global.stack.paths
		this.parent = parent
		this.model = model

		this.getSetting()
		this.find()

		this.on()
	}

	on() {
		window.$app.Event.on(`${this.namespace.value}/find`, this.find)
	}

	off() {
		this.global.stack.remove(this.namespace.value)

		window.$app.Event.off(`${this.namespace.value}/find`, this.find)
	}
}
