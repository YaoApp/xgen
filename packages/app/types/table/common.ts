export interface BaseColumn {
	name: string
	width?: number
}

export interface ViewComponents {
	[key: string]: string | FiledDetail
}

export interface FiledDetail {
	bind: string
	view?: {
		type: string
		props: any
		components?: ViewComponents
	}
	edit?: {
		type: string
		props: any
	}
}

export interface Fileds {
	[key: string]: FiledDetail
}
