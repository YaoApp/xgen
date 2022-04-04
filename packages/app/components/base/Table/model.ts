import { makeAutoObservable } from 'mobx'
import { injectable } from 'tsyringe'

import { Stack } from '@/context'
import { Utils } from '@/services'

import Service from './services'

import type { TableSetting, TableData, Column, SearchParams } from '@/types'
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

	constructor(private service: Service, private utils: Utils, public stack: Stack) {
		makeAutoObservable(this, {}, { autoBind: true })
	}

	async getSetting() {
		const { res, err } = await this.service.getSetting<TableSetting>(this.model)

		if (err) return

		this.setting = res
		this.filter_columns = this.utils.reduce(res.filter.columns, res.fileds.filter)
		this.table_columns = this.utils.reduce(res.table.columns, res.fileds.table)
	}

	async search() {
		const { res, err } = await this.service.search<SearchParams, TableData>(this.model)

		if (err) return

		const { data, page, pagesize, total } = res

		this.list = data
		this.pagination = { page, pagesize, total }
	}
}
