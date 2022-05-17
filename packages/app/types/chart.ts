import type { Action, Common } from '@/types'

export declare namespace Chart {
	interface Filter {
		columns: Array<Common.WideColumn>
	}

	interface FiledDetail {
		bind: string
		link?: string
		view: {
			type: string
			props: any
		}
		refer?: {
			type: string
			props: any
		}
	}

	interface Fileds {
		[key: string]: FiledDetail
	}

	interface Setting {
		name: string
		operation: {
			actions: Array<Action.Props>
		}
		filter: Filter
		chart: {
			columns: Array<Common.WideColumn>
		}
		fileds: {
			filter: Common.Fileds
			chart: Fileds
		}
	}

	interface Column extends Common.WideColumn, FiledDetail {}
}
