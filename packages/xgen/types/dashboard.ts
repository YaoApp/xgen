import type { Common } from '@/types'

export declare namespace Dashboard {
	type TableBind = {
		model: string
	}

	type ChartBind = {
		dataSource: string
	}

	interface Rows {
		width: number
		rows: Array<Common.WideColumn>
	}

	type Column = Common.WideColumn | Rows

	interface Setting {
		name: string
		dashboard: {
			columns: Array<Column>
		}
		fields: {
			dashboard: Common.ViewFields
		}
		config?: Common.Config
	}

	type TargetRows = {
		width: number
		rows: Array<TargetColumn>
	}

	type TargetColumnNormal = Common.WideColumn & Common.FieldDetail & { link?: string }
	type TargetColumn = TargetColumnNormal | TargetRows
}
