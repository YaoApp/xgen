export type Type = {
	name: string
	label?: string
	icon?: string | { name: string; size?: number; color?: string }
	color?: string
	width?: number
	resizable?: boolean // default true
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

export type PresetItem<T> = {
	name: string
	icon?: IconT
	image?: string
	cover?: string
	width?: 2 | 4 | 6 | 8 | 12
	description: string
	category?: string | number
	payload: T
}

export type Category = {
	value?: string | number
	label: string
}

export type PresetsResult<T> = PresetItem<T>[] | { categories: Category[]; presets: PresetItem<T>[] }

export type PresetsQuery = {
	keywords?: string
	category?: string | number
	withCategories?: boolean
	[key: string]: any
}

export type IconT =
	| string
	| {
			name: string
			size?: number
			color?: string
	  }
