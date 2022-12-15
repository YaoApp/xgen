import type { Action, Common } from '@/types'
import type { CSSProperties } from 'react'

export declare namespace Chart {
	interface Filter {
		columns: Array<Common.WideColumn>
	}

	interface FieldDetail {
		bind: string
		link?: string
		cardStyle?: CSSProperties
		view: {
			type: string
			props: any
		}
		refer?: {
			type: string
			props: any
		}
	}

	interface Fields {
		[key: string]: FieldDetail
	}

	interface Setting {
		name: string
		actions?: Array<Action.Props>
		filter?: Filter
		chart: {
			columns: Array<Common.WideColumn>
		}
		fields: {
			filter?: Common.Fields
			chart: Fields
		}
		config?: Common.Config
	}

	interface Column extends Common.WideColumn, FieldDetail {}
}
