import { message } from 'antd'
import { makeAutoObservable, toJS } from 'mobx'
import { injectable } from 'tsyringe'

import { GlobalModel } from '@/context/app'
import { filterEmpty } from '@/knife'
import { Namespace } from '@/models'
import { ColumnUtils, Common, Table } from '@/services'

import Service from './services'

import type { TableType, Common as CommonType, Global } from '@/types'
import type { Component } from '@/types'
import type { IProps } from './index'

@injectable()
export default class Model {
	parent = 'Page' as Component.StackComponent['parent']
	model = '' as Component.StackComponent['model']
	setting = {} as TableType.Setting
	list = [] as TableType.Data['data']
	batch_columns = [] as Array<CommonType.Column>
	filter_columns = [] as Array<CommonType.Column>
	table_columns = [] as Array<CommonType.Column>
	pagination = { page: 1, pagesize: 10, total: 0 } as Omit<TableType.Data, 'data'>
	search_params = {} as TableType.SearchParams
	batch = { active: false, selected: [] } as TableType.Batch
	rendered = false
	onChangeEventName = '' as string | undefined

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
		const { res, err } = await this.common.getSetting<TableType.Setting>('table', this.model)

		if (err) return

		this.rendered = true
		this.setting = res

		if (res.header.preset?.batch?.columns && res.header.preset?.batch?.columns?.length) {
			this.batch_columns = this.column_utils.reduce(res.header.preset.batch.columns, res.fields.table)
		} else {
			this.batch_columns = []
		}

		if (res.filter?.columns && res.filter?.columns?.length) {
			this.filter_columns = this.column_utils.reduce(res.filter.columns, res.fields.filter)
		} else {
			this.filter_columns = []
		}

		if (res.table.columns && res.table.columns?.length) {
			this.table_columns = this.column_utils.reduce(res.table.columns, res.fields.table)
		} else {
			this.table_columns = []
		}
	}

	async search(params?: TableType.SearchParams) {
		if (this.parent === 'Page' && this.rendered === false) this.global.loading = true

		const hideLoading = message.loading(this.global.locale_messages.messages.table.search)

		this.search_params = { ...this.search_params, ...filterEmpty(params) }

		const { res, err } = await this.service.search<TableType.SearchParams, TableType.Data>(
			this.model,
			this.search_params
		)

		this.global.loading = false

		hideLoading()

		if (err) return Promise.reject()

		const { data, page, pagesize, total } = res

		this.list = data
		this.pagination = { page, pagesize, total }

		return Promise.resolve(res)
	}

	async save(data: TableType.SaveRequest) {
		const hideLoading = message.loading(this.global.locale_messages.messages.table.save.loading)

		const { res, err } = await this.table.save<TableType.SaveRequest, TableType.SaveResponse>(this.model, data)

		hideLoading()

		if (err) return Promise.reject()

		message.success(this.global.locale_messages.messages.table.save.success)

		this.search()

		if (this.onChangeEventName) window.$app.Event.emit(this.onChangeEventName)

		return Promise.resolve(res)
	}

	async delete(primary_value: number) {
		const hideLoading = message.loading(this.global.locale_messages.messages.table.delete.loading)

		const { res, err } = await this.table.delete<TableType.DeleteResponse>(this.model, primary_value)

		hideLoading()

		if (err) return Promise.reject()

		message.success(this.global.locale_messages.messages.table.delete.success)

		this.search()

		return Promise.resolve(res)
	}

	async batchDelete() {
		const hideLoading = message.loading(this.global.locale_messages.messages.table.delete.loading)

		const { err } = await this.service.batchDelete<TableType.DeleteResponse>(
			this.model,
			this.setting.primary,
			this.batch.selected
		)

		hideLoading()

		if (err) return

		message.success(this.global.locale_messages.messages.table.delete.success)

		this.search()
	}

	async batchUpdate(data: Global.AnyObject) {
		const hideLoading = message.loading(this.global.locale_messages.messages.table.save.loading)

		const { err } = await this.service.batchUpdate<Global.AnyObject, TableType.SaveRequest>(
			this.model,
			this.setting.primary,
			this.batch.selected,
			data
		)

		hideLoading()

		if (err) return

		message.success(this.global.locale_messages.messages.table.save.success)

		this.search()
	}

	init(
		parent: Component.StackComponent['parent'],
		model: Component.StackComponent['model'],
		query: IProps['query'],
		data: IProps['data'],
		namespace: IProps['namespace'],
		params: TableType.SearchParams,
		onChangeEventName: IProps['onChangeEventName']
	) {
		this.setting = {} as TableType.Setting
		this.list = [] as TableType.Data['data']

		if (!namespace) {
			if (parent === 'Page' || parent === 'Modal') {
				this.global.stack.push(`Table-${parent}-${model}`)
				this.namespace.paths = toJS(this.global.stack.paths)
			}

			if (parent === 'Form' || parent === 'Dashboard') {
				const global_stack_paths = toJS(this.global.stack.paths)

				global_stack_paths.push(`Table-${parent}-${model}`)

				this.namespace.paths = global_stack_paths
			}
		} else {
			this.namespace.paths = [namespace]
		}

		this.search_params = {}

		if (query) this.search_params = { ...query }
		if (parent === 'Page') this.search_params = { ...this.search_params, ...params }

		this.rendered = false
		this.parent = parent
		this.model = model
		this.onChangeEventName = onChangeEventName

		this.getSetting()

		if (this.parent === 'Custom') {
			this.list = data!

			return
		}

		this.search()
		this.on()
	}

	resetSearchParams() {
		this.search_params = {}
	}

	refetch() {
		this.getSetting()
		this.search()
	}

	on() {
		window.$app.Event.on(`${this.namespace.value}/search`, this.search)
		window.$app.Event.on(`${this.namespace.value}/save`, this.save)
		window.$app.Event.on(`${this.namespace.value}/delete`, this.delete)
		window.$app.Event.on(`${this.namespace.value}/batchDelete`, this.batchDelete)
		window.$app.Event.on(`${this.namespace.value}/batchUpdate`, this.batchUpdate)
		window.$app.Event.on(`${this.namespace.value}/refetch`, this.refetch)
	}

	off() {
		window.$app.Event.off(`${this.namespace.value}/search`, this.search)
		window.$app.Event.off(`${this.namespace.value}/save`, this.save)
		window.$app.Event.off(`${this.namespace.value}/delete`, this.delete)
		window.$app.Event.off(`${this.namespace.value}/batchDelete`, this.batchDelete)
		window.$app.Event.off(`${this.namespace.value}/batchUpdate`, this.batchUpdate)
		window.$app.Event.off(`${this.namespace.value}/refetch`, this.refetch)

		this.global.stack.remove(this.namespace.paths.slice(-1)[0])
	}
}
