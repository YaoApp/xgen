export interface BaseColumn {
	name: string
	width?: number
}

export interface FiledDetail {
	bind: string
	view?: {
		type: string
		props: any
	}
	edit?: {
		type: string
		props: any
	}
}

export interface Fileds {
	[key: string]: FiledDetail
}
