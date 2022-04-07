import { message } from 'antd'
import { makeAutoObservable } from 'mobx'
import { injectable } from 'tsyringe'

import { GlobalModel } from '@/context/app'
import { Namespace } from '@/models'
import { Utils } from '@/services'
import { filterEmpty } from '@yaoapp/utils'

import Service from './services'

import type {
	TableSetting,
	TableData,
	Column,
	SearchParams,
	TableSaveData,
	TableSaveResponse,
	TableDeleteResponse
} from '@/types'
import type { IPropsTable } from './types'

@injectable()
export default class Model {
	parent = 'Page' as IPropsTable['parent']
	model = '' as IPropsTable['model']
	setting = {} as TableSetting
	list = [] as TableData['data']
	filter_columns = [] as Array<Column>
	table_columns = [] as Array<Column>
	pagination = { page: 1, pagesize: 10, total: 0 } as Omit<TableData, 'data'>
	search_params = {} as SearchParams

	constructor(
		private service: Service,
		private utils: Utils,
		public global: GlobalModel,
		public namespace: Namespace
	) {
		makeAutoObservable(this, {}, { autoBind: true })
	}

	async getSetting() {
		const { res, err } = await this.service.getSetting<TableSetting>(this.model)

		if (err) return

		this.setting = res
		this.filter_columns = this.utils.reduce(res.filter.columns, res.fileds.filter)
		this.table_columns = this.utils.reduce(res.table.columns, res.fileds.table)
	}

	async search(params?: SearchParams) {
		const hideLoading = message.loading(this.global.locale_messages.messages.table.search)

		this.search_params = { ...this.search_params, ...filterEmpty(params) }

		const { res, err } = await this.service.search<SearchParams, TableData>(
			this.model,
			this.search_params
		)

		hideLoading()

		if (err) return

		const { data, page, pagesize, total } = res

		this.list = data
		this.pagination = { page, pagesize, total }
	}

	async save(data: TableSaveData) {
		const hideLoading = message.loading(
			this.global.locale_messages.messages.table.save.loading
		)

		const { err } = await this.service.save<TableSaveData, TableSaveResponse>(
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

		const { err } = await this.service.delete<TableDeleteResponse>(
			this.model,
			primary_value
		)

		hideLoading()

		if (err) return

		message.success(this.global.locale_messages.messages.table.delete.success)

		this.search()
	}

	init(parent: IPropsTable['parent'], model: IPropsTable['model']) {
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
		this.global.stack.remove(this.namespace.value)

		window.$app.Event.off(`${this.namespace.value}/search`, this.search)
		window.$app.Event.off(`${this.namespace.value}/save`, this.save)
		window.$app.Event.off(`${this.namespace.value}/delete`, this.delete)
	}
}
