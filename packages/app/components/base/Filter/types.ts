import type { TableSetting, Column } from '@/types'
import type Model from '@/components/base/Table/model'

export interface IPropsFilter {
	model: string
	namespace: Model['namespace']['value']
	columns: Array<Column>
	btnAddText?: TableSetting['filter']['btnAddText']
	resetSearchParams: Model['resetSearchParams']
}

export interface Locale {
	[key: string]: {
		search: string
		reset: string
	}
}
