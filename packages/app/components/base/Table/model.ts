import { makeAutoObservable } from 'mobx'
import { injectable } from 'tsyringe'

import { Utils } from '@/services'

import Service from './services'

import type { SettingTable, Column } from '@/types'

@injectable()
export default class Model {
	model: string = ''
	setting = {} as SettingTable
	filter_columns = [] as Array<Column>
	table_columns = [] as Array<Column>

	constructor(private service: Service, private utils: Utils) {
		makeAutoObservable(this, {}, { autoBind: true })
	}

	async getSetting() {
		const { res, err } = await this.service.getSetting<SettingTable>(this.model)

		if (err) return

		this.setting = res
		this.filter_columns = this.utils.reduce(res.filter.columns, res.fileds.filter)
            this.table_columns = this.utils.reduce(res.table.columns, res.fileds.table)
	}
}
