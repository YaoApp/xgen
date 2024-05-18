import { PanelType, PanelColumnComponent } from '@/widgets'

export type Type = PanelType

export type Remote = {
	api: string
	params?: Record<string, any>
}

export type Setting = {
	title?: string
	types?: Type[]
	defaultValue?: FlowValue | FlowValue[]
	fields?: Record<string, PanelColumnComponent>
}

export type FlowNode = {
	id: string
	position: { x: number; y: number }
	type: string
	description: string
	props: Record<string, any>
	output?: any

	showTargetHandle?: boolean
	showSourceHandle?: boolean
}

export type FlowEdge = {
	source: string
	target: string
	condition?: string
}

export type FlowValue = {
	key?: string
	name?: string // the name of the flow
	label?: string // the label of the flow
	icon?: IconT // the icon of the flow
	mock?: any[] // the latest mock data of the flow
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
