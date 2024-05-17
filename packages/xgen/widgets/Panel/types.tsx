export type Type = {
	name: string
	label?: string
	icon?: string | { name: string; size?: number; color?: string }
	color?: string
	background?: string
	props?: Section[]
}

export type Section = {
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
