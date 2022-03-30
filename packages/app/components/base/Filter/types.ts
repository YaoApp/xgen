import type { TableSetting, Column } from '@/types'

export interface IPropsFilter {
	model: string
	columns: Array<Column>
	btnAddText: TableSetting['filter']['btnAddText']
}

export interface Locale {
	[key: string]: {
		search: string
		reset: string
	}
}
