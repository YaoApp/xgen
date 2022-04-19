import { message } from 'antd'
import { makeAutoObservable } from 'mobx'
import { injectable } from 'tsyringe'

import { GlobalModel } from '@/context/app'
import { Namespace } from '@/models'
import { ColumnUtils, Common, Table } from '@/services'
import { filterEmpty } from '@yaoapp/utils'

import Service from './services'

import type { TableType, Common as CommonType } from '@/types'
import type { Component } from '@/types'

@injectable()
export default class Model {
	parent = 'Page' as Component.StackComponent['parent']
	model = '' as Component.StackComponent['model']
	setting = {} as TableType.Setting
	list = [] as TableType.Data['data']
	filter_columns = [] as Array<CommonType.Column>
	table_columns = [] as Array<CommonType.Column>
	pagination = { page: 1, pagesize: 10, total: 0 } as Omit<TableType.Data, 'data'>
	search_params = {} as TableType.SearchParams

	constructor(
		private service: Service,
		private common: Common,
		private table: Table,
		private column_utils: ColumnUtils,
		public global: GlobalModel,
		public namespace: Namespace
	) {
		makeAutoObservable(this, {}, { autoBind: true })
	}

	async getSetting() {
		const { res, err } = await this.common.getSetting<TableType.Setting>(
			'table',
			this.model
		)

		if (err) return

		this.setting = res
		this.filter_columns = this.column_utils.reduce(res.filter.columns, res.fileds.filter)
		this.table_columns = this.column_utils.reduce(res.table.columns, res.fileds.table)
	}

	async search(params?: TableType.SearchParams) {
		const hideLoading = message.loading(this.global.locale_messages.messages.table.search)

		this.search_params = { ...this.search_params, ...filterEmpty(params) }

		const { res, err } = await this.service.search<TableType.SearchParams, TableType.Data>(
			this.model,
			this.search_params
		)

		hideLoading()

		if (err) return

		const { data, page, pagesize, total } = res

		this.list = data
		this.pagination = { page, pagesize, total }
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

		this.search()
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

		this.search()
	}

	init(parent: Component.StackComponent['parent'], model: Component.StackComponent['model']) {
		this.global.stack.push(`Table-${parent}-${model}`)

		this.namespace.paths = this.global.stack.paths
		this.parent = parent
		this.model = model

		this.getSetting()
		this.search()

		this.on()
	}

	resetSearchParams() {
		this.search_params = {}
	}

	on() {
		window.$app.Event.on(`${this.namespace.value}/search`, this.search)
		window.$app.Event.on(`${this.namespace.value}/save`, this.save)
		window.$app.Event.on(`${this.namespace.value}/delete`, this.delete)
	}

	off() {
		this.global.stack.remove(this.namespace.paths.slice(-1)[0])

		window.$app.Event.off(`${this.namespace.value}/search`, this.search)
		window.$app.Event.off(`${this.namespace.value}/save`, this.save)
		window.$app.Event.off(`${this.namespace.value}/delete`, this.delete)
	}
}
