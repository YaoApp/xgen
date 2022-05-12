import type { TableProps } from 'antd'
import type { Action, Common } from '@/types'

export declare namespace TableType {
	interface Filter {
		btnAddText: string
		columns: Array<Common.WideColumn>
	}

	interface Header {
		preset: {
			batch: {
				columns: Array<Common.WideColumn>
				delete: boolean
			}
			import: {
				bind: string
			}
		}
		actions: Array<{
			title: string
			icon: string
			props: {
				type: string
				payload: any
			}
		}>
	}

	interface Setting {
		primary: string
		header: Header
		filter: Filter
		table: {
			props: TableProps<any>
			columns: Array<Common.BaseColumn>
			operation: {
				width?: number
				hide?: boolean
				fold?: boolean
				actions: Array<Action.Props>
			}
		}
		fileds: {
			filter: Common.Fileds
			table: Common.Fileds
		}
	}

	interface SearchParams {
		[key: 'page' | 'pagesize' | string]: number | string
	}

	interface Data {
		data: Array<any>
		page: number
		pagesize: number
		total: number
	}

	interface SaveRequest {
		id: number
		[key: string]: any
	}

	type SaveResponse = number

	type DeleteResponse = number
}
