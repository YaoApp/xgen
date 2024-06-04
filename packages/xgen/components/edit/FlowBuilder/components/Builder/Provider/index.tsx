import React, { useCallback, useRef, MouseEvent, TouchEvent, useEffect } from 'react'
import { Dispatch, ReactNode, SetStateAction, createContext, useContext, useState } from 'react'
import { FlowEdge, FlowNode, FlowValue, Setting } from '../../../types'
import {
	useEdgesState,
	useNodesState,
	Node as ReactFlowNode,
	OnNodesChange,
	OnEdgesChange,
	OnConnect,
	OnConnectStart,
	OnConnectEnd,
	OnConnectStartParams,
	Connection,
	MarkerType,
	addEdge,
	Edge
} from 'reactflow'
import { getLocale } from '@umijs/max'
import { message } from 'antd'
import { Component } from '@/types'
import { CreateID } from '../../../utils'

interface BuilderContextType {
	setting?: Setting
	setSetting?: Dispatch<SetStateAction<Setting | undefined>>

	hideContextMenu?: boolean | undefined
	setHideContextMenu?: Dispatch<SetStateAction<boolean | undefined>>

	nodes: ReactFlowNode<any>[]
	setNodes: Dispatch<SetStateAction<ReactFlowNode<any>[]>>

	edges: any[]
	setEdges: Dispatch<SetStateAction<any[]>>

	onNodesChange: OnNodesChange
	onEdgesChange: OnEdgesChange

	is_cn: boolean

	onDelete: (id: string) => void
	onAdd: (id: string, type: string) => void
	onDuplicate: (id: string) => void
	onSettingNode: (id: string) => void
	onSettingEdge: (edge: Edge) => void
	onConnect: OnConnect
	onConnectStart: OnConnectStart
	onConnectEnd: OnConnectEnd

	onPanelChange: (id: string, bind: string, value: any) => void

	value?: FlowValue
	setValue?: Dispatch<SetStateAction<FlowValue | undefined>>

	CreateNode: (
		typeName: string,
		description: string,
		position: { x: number; y: number },
		props?: Record<string, any>
	) => any

	panelNode: ReactFlowNode<any> | undefined
	setPanelNode: Dispatch<SetStateAction<ReactFlowNode<any> | undefined>>

	panelEdge: Edge | undefined
	setPanelEdge: Dispatch<SetStateAction<Edge | undefined>>

	openPanel: boolean
	setOpenPanel: Dispatch<SetStateAction<boolean>>

	showMask: boolean
	setShowMask: Dispatch<SetStateAction<boolean>>

	running: boolean
	setRunning: Dispatch<SetStateAction<boolean>>

	openSettings: boolean
	setOpenSettings: Dispatch<SetStateAction<boolean>>

	openExecute: boolean
	setOpenExecute: Dispatch<SetStateAction<boolean>>

	openPresets: boolean
	setOpenPresets: Dispatch<SetStateAction<boolean>>

	openEdge: boolean
	setOpenEdge: Dispatch<SetStateAction<boolean>>

	execute?: Component.Request
	presets?: Component.Request

	fullscreen: boolean
	setFullscreen: (value: boolean) => void

	removeAttribution?: boolean

	__namespace?: string
	__bind?: string

	EdgeStyle: (theme: string) => any
}

interface IProps {
	id: string
	value?: FlowValue
	onData?: (id: string, type: string, value: any) => void

	children: ReactNode
	setting?: Setting
	execute?: Component.Request
	presets?: Component.Request
	name?: string
	__namespace?: string
	__bind?: string

	fullscreen: boolean
	setFullscreen: (value: boolean) => void

	showMask: boolean
	setShowMask: Dispatch<SetStateAction<boolean>>

	removeAttribution?: boolean
}

const BuilderContext = createContext<BuilderContextType | undefined>(undefined)
export const BuilderProvider: React.FC<IProps> = (props) => {
	// Initialize the nodes
	const Nodes = (value?: FlowValue) => {
		const nodes: any[] = []
		value?.nodes?.forEach((node: FlowNode) => {
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
				position: node.position,
				data: {
					showSourceHandle: node.showSourceHandle,
					showTargetHandle: node.showTargetHandle,
					deletable: node.deletable,
					props: node.props || {},
					type: node.type,
					icon: nodeType.icon,
					color: nodeType.color,
					background: className,
					typeLabel: nodeType.label || nodeType.name
				}
			})
		})

		return nodes
	}

	// Initialize the edges
	const Edges = (value?: FlowValue) => {
		const edges: any[] = []
		value?.edges?.forEach((edge) => {
			const source = ID(edge.source)
			const target = ID(edge.target)
			edge.id = ID(edge.id)
			const sourceNode = nodes.find((node) => node.id === source)
			const targetNode = nodes.find((node) => node.id === target)
			if (!sourceNode || !targetNode) return

			const background = sourceNode?.data?.background
			const style = EdgeStyle(background)
			const newEdge = { ...edge, ...style, type: 'custom' }
			edges.push(newEdge)
		})

		return edges
	}

	const CreateNode = (
		typeName: string,
		description: string,
		position: { x: number; y: number },
		props?: Record<string, any>
	) => {
		const nodeType = setting?.types?.find((type) => type.name === typeName)
		if (!nodeType) {
			console.error(`[FlowBuilder] Node type ${typeName} not found`)
			return
		}

		const node: FlowNode = {
			id: ID(),
			type: typeName,
			props: { description: description, ...props },
			position: position
		}
		const className = nodeType.background || 'default'
		return {
			id: node.id,
			type: 'custom',
			sourcePosition: 'right',
			targetPosition: 'left',
			className: className,
			data: {
				props: node.props || {},
				deletable: true,
				type: node.type,
				icon: nodeType.icon,
				color: nodeType.color,
				background: className,
				typeLabel: nodeType.label || nodeType.name
			},
			position: position
		}
	}

	const ID = (id?: string | number): string => {
		if (id === undefined) return CreateID()
		if (typeof id === 'number') return `${id}`
		return id
	}

	const EdgeStyle = (theme: string) => {
		let color = 'var(--color_title)'
		switch (theme) {
			case 'primary':
				color = 'var(--color_main)'
				break
			case 'success':
				color = 'var(--color_success)'
				break
			case 'warning':
				color = 'var(--color_warning)'
				break
			case 'danger':
				color = 'var(--color_danger)'
				break
		}
		return {
			style: { strokeWidth: 2, stroke: color },
			markerEnd: { type: MarkerType.ArrowClosed, width: 12, color: color }
		}
	}

	const is_cn = getLocale() === 'zh-CN'
	const [value, setValue] = useState<FlowValue | undefined>(props.value)
	const [setting, setSetting] = useState<Setting | undefined>(props.setting)
	const [hideContextMenu, setHideContextMenu] = useState<boolean | undefined>(undefined)
	const [nodes, setNodes, onNodesChange] = useNodesState(Nodes(value))
	const [edges, setEdges, onEdgesChange] = useEdgesState(Edges(value))
	const [openSettings, setOpenSettings] = useState(false)
	const [openExecute, setOpenExecute] = useState(false)
	const [openPresets, setOpenPresets] = useState(false)
	const [mask, setMask] = useState(true)

	const [openEdge, setOpenEdge] = useState(false)
	const [running, setRunning] = useState(false)

	const [openPanel, setOpenPanel] = useState(false)
	const [panelNode, setPanelNode] = useState<ReactFlowNode<any> | undefined>(undefined)
	const [panelEdge, setPanelEdge] = useState<Edge | undefined>(undefined)

	const [fullscreen, setFullscreen] = useState<boolean>(props.fullscreen)

	const setShowMask: Dispatch<SetStateAction<boolean>> = (mask) => {
		setMask(mask)
		props.setShowMask(mask)
	}

	const onData = (id: string, type: string, value: any) => {
		// Set the value of the form
		setValue?.((val) => {
			if (!val) return
			if (type === 'nodes') val.nodes = value
			if (type === 'edges') val.edges = value
			if (type === 'execute') val.execute = value
			// if (type === 'flow') val.flow = { ...value }
			return { ...val }
		})

		props.onData?.(id, type, value)
	}

	const onDelete = useCallback((id: string) => {
		setNodes((nds) => {
			return nds.filter((node) => node.id !== id)
		})
	}, [])

	const fixPosition = (position: { x: number; y: number }, nds: any): { x: number; y: number } => {
		const node = nds.find((n: any) => n.position.x === position.x && n.position.y === position.y)
		if (node) {
			position.y += 150
			return fixPosition(position, nds)
		}
		return position
	}

	const onAdd = useCallback((id: string, type: string) => {
		setNodes((nds: any) => {
			const node = nds.find((n: any) => n.id === id)
			if (!node) {
				console.error(`[FlowBuilder] Node ${id} not found`)
				return
			}
			const position = fixPosition({ x: (node?.position?.x || 0) + 400, y: node?.position?.y || 0 }, nds)
			const description = is_cn ? '<未命名>' : '<Unnamed>'
			const newNode = CreateNode(type, description, { x: position?.x, y: position?.y })
			if (newNode?.id) connecting.current = newNode.id
			return nds.concat(newNode as any)
		})

		// connect to the new node
		if (connecting.current) {
			setNodes((nds: any) => {
				let source = nds.find((n: any) => n.id === id)
				const background = source?.data?.background
				const style = EdgeStyle(background)
				const connection = {
					source: source.id,
					target: connecting.current,
					sourceHandle: null,
					targetHandle: null
				}

				const newEdge = { ...connection, ...style, type: 'custom', data: { label: '' } }
				setEdges((eds) => {
					eds.forEach((edge: any) => {
						if (edge.source === connection.source) {
							newEdge.data.label = is_cn ? '<条件>' : '<Condition>'
							if (!edge.data?.label) {
								edge.data = { ...edge.data, label: is_cn ? '<条件>' : '<Condition>' }
							}
						}
					})
					return addEdge(newEdge, eds)
				})
				return nds
			})
		}
	}, [])

	const onDuplicate = useCallback((id: string) => {
		setNodes((nds: any) => {
			const node = nds.find((n: any) => n.id === id)
			if (!node) {
				console.error(`[FlowBuilder] Node ${id} not found`)
				return
			}
			const data = { ...(node?.data || {}) }
			const position = { x: (node?.position?.x || 0) + 400, y: node?.position?.y || 0 }
			const newID = ID()
			data.props = { ...data.props, description: `[${is_cn ? '复本' : 'Copy'}] ${data.props?.description}` }
			const newNode = {
				...{ ...node },
				id: newID,
				data: { ...data, deletable: true, showSourceHandle: true, showTargetHandle: true },
				position: position
			}
			return nds.concat(newNode as any)
		})
	}, [])

	// Open Node Setting Panel
	const onSettingNode = useCallback((id: string) => {
		setNodes((nds: any) => {
			const node = nds.find((n: any) => n.id === id)
			if (!node) {
				console.error(`[FlowBuilder] Node ${id} not found`)
				return
			}

			setPanelNode(() => node)
			setOpenExecute(() => false)
			setOpenSettings(() => false)
			setOpenPresets(() => false)
			setOpenEdge(() => false)

			setShowMask(true)
			setOpenPanel(() => true)
			return nds
		})
	}, [])

	// Open Edge Setting Panel
	const onSettingEdge = useCallback((edge: Edge) => {
		setPanelEdge(() => edge)
		setOpenEdge(() => true)
		setOpenExecute(() => false)
		setOpenSettings(() => false)
		setOpenPresets(() => false)

		setShowMask(true)
		setOpenPanel(() => true)
	}, [])

	// const connectingNodeId = useRef(null)
	const connecting = useRef<string | null>(null)

	const onConnect = useCallback(
		(connection: Connection) => {
			connecting.current = null
			let source: any = null
			setNodes((nds) => {
				source = nds.find((node) => node.id === connection.source)
				return nds
			})

			if (!source) {
				console.error(`[FlowBuilder] Node ${connection.source} not found`)
				message.error(
					is_cn ? `节点 ${connection.source} 未找到` : `Node ${connection.source} not found`
				)
				return
			}

			// conecting to itself is not allowed
			if (connection.source === connection.target) {
				message.error(is_cn ? '不允许连接到自身' : 'Connecting to itself is not allowed')
				return
			}

			const background = source?.data?.background
			const style = EdgeStyle(background)
			const newEdge = { ...connection, ...style, type: 'custom', data: { label: '' } }
			setEdges((eds) => addEdge(newEdge, eds))
		},
		[setEdges]
	)

	const onConnectStart = useCallback(
		(event: MouseEvent | TouchEvent, params: OnConnectStartParams) => (connecting.current = params.nodeId),
		[]
	)

	const onConnectEnd = useCallback(({ nodeId, handleType }: any) => {}, [])

	const onSetFullscreen = (value: boolean) => {
		setFullscreen(() => value)
		props.setFullscreen(value)
	}

	const onPanelChange = (id: string, bind: string, value: any) => {
		if (openSettings) {
			setValue?.((val) => {
				if (val?.flow) {
					val.flow[bind] = value
				}
				onData(props.id, 'flow', { ...val?.flow })
				return { ...val }
			})
			return
		}

		if (openExecute) {
			setValue?.((val) => {
				if (val?.execute) {
					val.execute[bind] = value
				}
				onData(props.id, 'execute', { ...val?.execute })
				return { ...val }
			})
			return
		}

		if (openEdge) {
			setEdges((eds) => {
				const edge = eds.find((item) => item.id === id)
				if (!edge) return eds
				if (!edge.data) edge.data = {}
				edge.data[bind] = value
				return [...eds]
			})
			return
		}

		setNodes((nds) => {
			const node = nds.find((item) => item.id === id)
			if (!node) return nds
			node.data.props[bind] = value
			return [...nds]
		})
	}

	// Trigger the onData event
	useEffect(() => {
		const newEdges: FlowEdge[] = []
		edges.forEach((edge) => {
			newEdges.push({
				source: edge.source,
				target: edge.target,
				data: { ...edge.data }
			})
		})

		onData(props.id, 'edges', newEdges)
	}, [edges])

	useEffect(() => {
		const newNodes: FlowNode[] = []
		nodes.forEach((node) => {
			const data = { ...node.data }
			newNodes.push({
				id: node.id,
				type: data.type,
				position: node.position,
				showTargetHandle: data.showTargetHandle,
				showSourceHandle: data.showSourceHandle,
				deletable: data.deletable,
				props: data.props
			})
			onData(props.id, 'nodes', newNodes)
		})
	}, [nodes])

	return (
		<BuilderContext.Provider
			value={{
				setting,
				setSetting,

				hideContextMenu,
				setHideContextMenu,

				nodes,
				setNodes,
				edges,
				EdgeStyle,
				setEdges,
				onNodesChange,
				onEdgesChange,

				onConnect,
				onConnectStart,
				onConnectEnd,

				onDelete,
				onAdd,
				onDuplicate,
				onSettingNode,
				onSettingEdge,

				is_cn,
				value,
				setValue,

				CreateNode,

				panelNode,
				setPanelNode,
				panelEdge,
				setPanelEdge,

				openPanel,
				setOpenPanel,
				showMask: mask,
				setShowMask,

				running,
				setRunning,

				openSettings,
				setOpenSettings,
				openExecute,
				setOpenExecute,
				openEdge,
				setOpenEdge,
				openPresets,
				setOpenPresets,

				onPanelChange,

				execute: props.execute,
				presets: props.presets,

				fullscreen,
				setFullscreen: onSetFullscreen,

				removeAttribution: props.removeAttribution,

				__namespace: props.__namespace,
				__bind: props.__bind
			}}
		>
			{props.children}
		</BuilderContext.Provider>
	)
}

export const useBuilderContext = (): BuilderContextType => {
	const context = useContext(BuilderContext)
	if (context === undefined) {
		throw new Error('useBuilderContext must be used within a GlobalProvider')
	}
	return context
}
