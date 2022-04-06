import type Filter from './filter'
import type Header from './header'
import type Action from './action'
import type { TableProps } from 'antd'
import type { BaseColumn, Fileds, FiledDetail, ViewComponents } from './common'
import type { IConfigCommonOpenModal } from './action'

export interface TableSetting {
	primary: string
	header: Header
	filter: Filter
	table: {
		props: TableProps<any>
		columns: Array<BaseColumn>
		operation: {
			width?: number
			hide?: boolean
			fold?: boolean
			actions: Array<Action>
		}
	}
	fileds: {
		filter: Fileds
		table: Fileds
	}
}

export type TableData = {
	data: Array<any>
	page: number
	pagesize: number
	total: number
}

export interface TableSaveData {
	id: number
	[key: string]: any
}

export type TableSaveResponse = number
export type TableDeleteResponse = number

export type Column = BaseColumn & FiledDetail

export { Action, BaseColumn, Fileds, FiledDetail, ViewComponents, IConfigCommonOpenModal }
