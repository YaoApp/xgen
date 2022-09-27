import type { TableType, Common } from '@/types'
import type Model from '@/components/base/Table/model'

export interface IPropsFilter {
	model: string
	columns: Array<Common.Column>
	btnAddText?: TableType.Setting['filter']['btnAddText']
	isChart?: boolean
	onAdd?: () => void
	onFinish: (v: any) => void
	resetSearchParams: Model['resetSearchParams']
}

export interface Locale {
	[key: string]: {
		search: string
		reset: string
	}
}
