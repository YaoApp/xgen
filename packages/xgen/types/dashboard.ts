import type { Common } from '@/types'
import type { CSSProperties } from 'react'

export declare namespace Dashboard {
	type TableBind = {
		model: string
	}

	type FormBind = {
		model: string
		id: number
		formType: 'view' | 'edit'
	}

	type ChartBind = {
		dataSource: string
	}

	interface FieldDetail {
		type: string
		bind: TableBind | FormBind | ChartBind
		props: any
		link?: string
		cardStyle?: CSSProperties
	}

	interface Fields {
		[key: string]: FieldDetail
	}

	interface Rows {
		width: number
		rows: Array<Common.WideColumn>
	}

	type Column = Common.WideColumn | Rows

	interface Setting {
		name: string
		free: {
			columns: Array<Column>
		}
		fields: {
			free: Fields
		}
		config?: Common.Config
	}

	type TargetRows = {
		width: number
		rows: Array<TargetColumn>
	}

	type TargetColumnNormal = Common.WideColumn & FieldDetail
	type TargetColumn = TargetColumnNormal | TargetRows
}
