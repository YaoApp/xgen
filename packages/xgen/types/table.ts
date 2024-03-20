import type { TableProps } from 'antd'
import type { Action, Common } from '@/types'

export declare namespace TableType {
	interface Filter {
		columns: Array<Common.WideColumn>
		actions?: Array<{ action: Array<Action.ActionParams> } & Pick<Action.Props, 'title' | 'icon'>>
	}

	interface Header {
		preset: {
			batch?: {
				columns: Array<Common.WideColumn>
				deletable: boolean
			}
			import?: {
				api: {
					setting: string
					mapping: string
					preview: string
					import: string
					mapping_setting_model: string
					preview_setting_model: string
				}
				actions?: Array<{ action: Array<Action.ActionParams> } & Pick<Action.Props, 'title' | 'icon'>>
			}
		}
		actions?: Array<{
			title: string
			icon: string
			props: {
				type: string
				payload: any
			}
		}>
	}

	interface CustomTableProps {
		customStyle?: 'compact'
		withTotalRow?: boolean
		hidePagination?: boolean
	}

	interface Setting {
		name: string
		primary: string
		header: Header
		filter: Filter
		table: {
			props?: TableProps<any> & CustomTableProps
			columns: Array<Common.TableBaseColumn>
			operation: {
				width?: number
				hide?: boolean
				fold?: boolean
				actions: Array<Action.Props>
			}
		}
		fields: {
			filter: Common.Fields
			table: Common.Fields
		}
		config?: Common.Config & {
			actionWithQuery?: boolean
		}
	}

	interface SearchParams {
		[key: 'page' | 'pagesize' | string]: number | string
	}

	interface Batch {
		active: boolean
		selected: Array<number>
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
