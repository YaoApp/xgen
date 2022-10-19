export declare namespace Common {
	interface Config {
		full?: boolean
	}

	interface BaseColumn {
		name: string
		width?: number
	}

	interface WideColumn {
		name: string
		width: number
	}

	interface ViewComponents {
		[key: string]: string | FiledDetail
	}

	interface FiledDetail {
		bind: string
		view: {
			type: string
			props: any
			components?: ViewComponents
		}
		edit: {
			type: string
			props: any
		}
	}

	interface Fields {
		[key: string]: FiledDetail
	}

	interface Column extends BaseColumn, FiledDetail {}

	type DynamicValue = `:${string}` | string
}
