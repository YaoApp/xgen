import { PanelType, PanelSection, PanelColumnComponent } from '@/widgets'

export type Type = PanelType

export type Remote = {
	api: string
	params?: Record<string, any>
}

export type Setting = {
	flow?: PanelSection[]
	execute?: PanelSection[]
	types?: Type[]
	fields?: Record<string, PanelColumnComponent>
	defaultValue?: FlowValue | FlowValue[]
}

export type FlowNode = {
	id: string
	position: { x: number; y: number }
	type: string
	showTargetHandle?: boolean
	showSourceHandle?: boolean
	props: {
		name?: string
		label?: string
		description?: string
		output?: string
		[key: string]: any
	}
}

export type FlowEdge = {
	source: string
	target: string
	condition?: string
}

export type FlowValue = {
	key?: string
	flow?: {
		name?: string // the name of the flow
		label?: string // the label of the flow
		icon?: IconT // the icon of the flow
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
