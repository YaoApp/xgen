import { FlowValue, Setting } from '../../types'

export const Nodes = (value?: FlowValue, setting?: Setting, events?: { [key: string]: any }) => {
	const nodes: any[] = []
	value?.nodes?.forEach((node) => {
		const nodeType = setting?.types?.find((type) => type.name === node.type)
		if (!nodeType) {
			console.error(`[FlowBuilder] Node type ${node.type} not found`)
			return
		}
		const className = nodeType.background || 'default'
		nodes.push({
			id: ID(node.id),
			type: 'custom',
			sourcePosition: 'right',
			targetPosition: 'left',
			className: className,
			data: {
				...node,
				icon: nodeType.icon,
				color: nodeType.color,
				background: className,
				typeLabel: nodeType.label || nodeType.name,
				events: events
			},
			position: node.position
		})
	})

	return nodes
}

export const CreateNode = (
	typeName: string,
	description: string,
	position: { x: number; y: number },
	setting?: Setting,
	events?: { [key: string]: any }
) => {
	const nodeType = setting?.types?.find((type) => type.name === typeName)
	if (!nodeType) {
		console.error(`[FlowBuilder] Node type ${typeName} not found`)
		return
	}

	const node = {
		id: ID(),
		type: typeName,
		props: {},
		description: description
	}
	const className = nodeType.background || 'default'
	return {
		id: node.id,
		type: 'custom',
		sourcePosition: 'right',
		targetPosition: 'left',
		className: className,
		data: {
			...node,
			icon: nodeType.icon,
			color: nodeType.color,
			background: className,
			typeLabel: nodeType.label || nodeType.name,
			events: events
		},
		position: position
	}
}

export const ID = (id?: string | number): string => {
	if (id === undefined) return `${Date.now()}${Math.random()}`
	if (typeof id === 'number') return `${id}`
	return id
}
