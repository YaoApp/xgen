export type Type = {
	name: string
	label?: string
	icon?: string
	props?: TypeProp[]
}

export type TypeProp = {
	title?: string
	columns: Column[]
}

export type Column = {
	name: string
	width?: number
	component?: ColumnComponent
}

export type ColumnComponent = {
	bind: string
	edit: {
		type: string
		props: Record<string, any>
	}
}
