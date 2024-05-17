import GridLayout from 'react-grid-layout'
import { PanelType, PanelColumnComponent } from '@/widgets'

export type Type = PanelType

export type Field = {
	id?: string
	type: string
	width?: number
	x?: number
	y?: number
	props?: Record<string, any>
}

export type Remote = {
	api: string
	params?: Record<string, any>
}

export type Setting = {
	title?: string
	defaultValue?: Field[]
	types?: Type[]
	fields?: Record<string, PanelColumnComponent>
}

export type Preset = Field & { icon?: string }
export type Presets = Preset[]
export type Layout = GridLayout.Layout
