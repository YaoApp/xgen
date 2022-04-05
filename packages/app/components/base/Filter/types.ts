import type { TableSetting, Column } from '@/types'
import type Model from '@/components/base/Table/model'

export interface IPropsFilter {
	model: string
	columns: Array<Column>
	btnAddText: TableSetting['filter']['btnAddText']
	namespace: Model['namespace']['value']
}

export interface Locale {
	[key: string]: {
		search: string
		reset: string
	}
}
