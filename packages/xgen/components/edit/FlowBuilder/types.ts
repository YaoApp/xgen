import { PanelType, PanelSection, PanelColumnComponent } from '@/widgets'
import { TabPaneProps } from 'antd'
import { ReactNode } from 'react'

export type Type = PanelType

export type Remote = {
	api: string
	params?: Record<string, any>
}

export type Setting = {
	flow?: PanelSection[]
	execute?: PanelSection[]
	edge?: PanelSection[]
	types?: Type[]
	fields?: Record<string, PanelColumnComponent>
	defaultValue?: FlowValue | FlowValue[]
}

export type PresetItem = {
	name: string
	icon?: IconT
	image?: string
	cover?: string
	width?: 2 | 4 | 6 | 8 | 12
	description: string
	category?: string | number
	nodes: FlowNode[]
	edges?: FlowEdge[]
}

export type Category = {
	value?: string | number
	label: string
}

export type PresetsResult = PresetItem[] | { categories: Category[]; presets: PresetItem[] }

export type PresetsQuery = {
	keywords?: string
	category?: string | number
	withCategories?: boolean
	[key: string]: any
}

export type FlowTab = Omit<TabPaneProps, 'tab'> & {
	label: ReactNode
	value: FlowValue
	key: string
	width?: number
	height?: number
	isFixed?: boolean
	showSidebar?: boolean
}

export type FlowNode = {
	id: string
	position: { x: number; y: number }
	type: string
	showTargetHandle?: boolean
	showSourceHandle?: boolean
	deletable?: boolean
	props: {
		name?: string
		label?: string
		description?: string
		output?: string
		[key: string]: any
	}
}

export type FlowEdge = {
	id?: string
	source: string
	target: string
	data?: Data
}

export type FlowValue = {
	id?: string
	key?: string
	flow?: {
		name?: string // the name of the flow
		label?: string // the label of the flow
		icon?: IconT // the icon of the flow
		closable?: boolean // the icon of the flow
		[key: string]: any // the other properties of the flow
	}

	execute?: {
		input?: any // the input of the flow
		query?: Record<string, any> // the query of the execute
		[key: string]: any // the other properties of the execute
	}

	data?: Data[] | Data
	nodes?: FlowNode[]
	edges?: FlowEdge[]
}

export type Data = {
	[key: string]: any
}

export type IconT =
	| string
	| {
			name: string
			size?: number
			color?: string
	  }
