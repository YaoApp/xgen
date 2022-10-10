import type { TableType, Common } from '@/types'
import type Model from '@/components/base/Table/model'

export interface IPropsFilter {
	model: string
	columns: Array<Common.Column>
	actions: TableType.Setting['filter']['actions']
	isChart?: boolean
	onFinish: (v: any) => void
	resetSearchParams: Model['resetSearchParams']
}

export interface IPropsActions{
      actions: TableType.Setting['filter']['actions']
}

export interface Locale {
	[key: string]: {
		search: string
		reset: string
	}
}
