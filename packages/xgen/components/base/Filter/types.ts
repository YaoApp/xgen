import type { TableType, Common } from '@/types'
import type Model from '@/components/base/Table/model'
import { Namespace } from '@/models'

export interface IPropsFilter {
      model: string
	columns: Array<Common.Column>
      actions?: TableType.Setting[ 'filter' ][ 'actions' ]
	namespace?: Namespace['value']
	isChart?: boolean
	onFinish: (v: any) => void
	resetSearchParams: Model['resetSearchParams']
}

export interface IPropsActions{
	namespace: Namespace['value']
      actions: TableType.Setting[ 'filter' ][ 'actions' ]
}

export interface Locale {
	[key: string]: {
		search: string
		reset: string
	}
}
