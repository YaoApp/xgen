import GridLayout from 'react-grid-layout'

export type Type = {
	name: string
	label?: string
	icon?: string
	props?: TypeProp[]
}

export type Field = {
	id?: string
	type: string
	width?: number
	x?: number
	y?: number
	props?: Record<string, any>
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

export type Remote = {
	api: string
	params?: Record<string, any>
}

export type Setting = {
	defaultValue?: Field[]
	types?: Type[]
	fields?: Record<string, ColumnComponent>
}

export type Presets = Field[]

export type Layout = GridLayout.Layout
