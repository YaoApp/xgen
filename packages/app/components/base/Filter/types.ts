import type { SettingTable, Column } from '@/types'

export interface IPropsFilter {
	model: string
	columns: Array<Column>
	btnAddText: SettingTable['filter']['btnAddText']
}

export interface Locale {
	[key: string]: {
		search: string
		reset: string
	}
}
