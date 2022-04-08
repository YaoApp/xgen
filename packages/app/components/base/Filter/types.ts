import type { TableType, Common } from '@/types'
import type Model from '@/components/base/Table/model'

export interface IPropsFilter {
	model: string
	namespace: Model['namespace']['value']
	columns: Array<Common.Column>
	btnAddText?: TableType.Setting['filter']['btnAddText']
	resetSearchParams: Model['resetSearchParams']
}

export interface Locale {
	[key: string]: {
		search: string
		reset: string
	}
}
