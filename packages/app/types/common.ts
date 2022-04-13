export declare namespace Common {
	interface BaseColumn {
		name: string
		width?: number
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

	interface Fileds {
		[key: string]: FiledDetail
	}

	interface Column extends BaseColumn, FiledDetail {}
}
