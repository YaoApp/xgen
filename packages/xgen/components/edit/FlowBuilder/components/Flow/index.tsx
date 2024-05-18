import Preset from '@/components/edit/FormBuilder/components/Preset'
import { Icon } from '@/widgets'
import { Button } from 'antd'

import styles from './index.less'
import clsx from 'clsx'
import ReactFlow, {
	Background,
	Controls,
	EdgeTypes,
	MarkerType,
	ReactFlowInstance,
	ReactFlowProvider,
	addEdge,
	useEdgesState,
	useNodesState,
	useReactFlow,
	Node as ReactFlowNode
} from 'reactflow'
import { useCallback, useEffect, useRef, useState } from 'react'
import CustomEdge from './Edge'

import 'reactflow/dist/style.css'
import CustomNode from './Node'
import { FlowValue, Setting } from '../../types'
import { CreateNode, ID, Nodes } from './utils'
import { getLocale } from '@umijs/max'
import { FlowProvider, useFlowContext } from './Provider'

interface IProps {
	name?: string
	width: number
	height: number
	setting?: Setting
	value?: FlowValue
	openPanel?: (node: ReactFlowNode<any>) => void
	onDataChange?: (data: any) => void
	updateData?: { id: string; bind: string; value: any }
}

const edgeTypes: EdgeTypes = {
	custom: CustomEdge
}

const nodeTypes = {
	custom: CustomNode
}

const Flow = (props: IProps) => {
	const is_cn = getLocale() === 'zh-CN'

	let id = 2
	const getId = () => `${id++}`
	const getEdgeStyle = (theme: string) => {
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
			style: {
				strokeWidth: 2,
				stroke: color
			},
			markerEnd: {
				type: MarkerType.ArrowClosed,
				width: 12,
				color: color
			}
		}
	}
	const initialEdges: any[] = []

	const onDelete = useCallback((id: string) => {
		setNodes((nds) => nds.filter((node) => node.id !== id))
	}, [])

	const onAdd = useCallback((id: string, type: string) => {
		setNodes((nds: any) => {
			const node = nds.find((n: any) => n.id === id)
			if (!node) {
				console.error(`[FlowBuilder] Node ${id} not found`)
				return
			}
			const position = { x: (node?.position?.x || 0) + 400, y: node?.position?.y || 0 }
			const description = is_cn ? '<未命名>' : '<Unnamed>'
			const newNode = CreateNode(
				type,
				description,
				{ x: position?.x, y: position?.y },
				props.setting,
				itemEvents
			)
			return nds.concat(newNode as any)
		})
	}, [])

	const onDuplicate = useCallback((id: string) => {
		setNodes((nds: any) => {
			const node = nds.find((n: any) => n.id === id)
			if (!node) {
				console.error(`[FlowBuilder] Node ${id} not found`)
				return
			}
			const data = node?.data || {}
			const position = { x: (node?.position?.x || 0) + 400, y: node?.position?.y || 0 }
			const newID = ID()
			const newNode = {
				...node,
				id: newID,
				data: {
					...node,
					...data,
					id: newID,
					description: `[${is_cn ? '复本' : 'Copy'}] ${data.description}`
				},
				position: position
			}
			return nds.concat(newNode as any)
		})
	}, [])

	const onSetting = useCallback((id: string) => {
		console.log(
			'setting',
			id,
			nodes.find((n: any) => n.id === id)
		)
		setNodes((nds: any) => {
			const node = nds.find((n: any) => n.id === id)
			if (!node) {
				console.error(`[FlowBuilder] Node ${id} not found`)
				return
			}
			// Open the panel
			node.selected = true
			props.openPanel && props.openPanel(node)
			return nds
		})
	}, [])

	const itemEvents = {
		onSetting,
		onDelete,
		onDuplicate,
		onAdd
	}

	const [reactFlowInstance, setReactFlowInstance] = useState<ReactFlowInstance | null>(null)
	const reactFlowWrapper = useRef(null)
	const connectingNodeId = useRef(null)
	const [nodes, setNodes, onNodesChange] = useNodesState(Nodes(props.value, props.setting, itemEvents))
	const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges)

	// Responsible for the panel update
	useEffect(() => {
		if (!props.updateData) return
		setNodes((nds) => {
			if (!props.updateData) return nds
			const data = props.updateData
			const newNodes = nds.map((node: any) => {
				if (node.id !== data.id) return node

				console.log('update-data', data.id, node.id)
				const newNode = { ...node }
				newNode.data.props = { ...node.data.props, [data.bind]: data.value }
				if (data.bind === 'description') {
					newNode.data.description = data.value
				}
				return newNode
			})

			props.onDataChange && props.onDataChange(nodes)
			return newNodes
		})
	}, [props.updateData])

	const { screenToFlowPosition } = useReactFlow()

	const onDrop = useCallback(
		(event: any) => {
			event.preventDefault()
			const type = event.dataTransfer.getData('application/reactflow')
			const position = reactFlowInstance?.screenToFlowPosition({
				x: event.clientX,
				y: event.clientY
			})
			if (!position) return

			const description = is_cn ? '<未命名>' : '<Unnamed>'
			const newNode = CreateNode(
				type,
				description,
				{ x: position?.x, y: position?.y },
				props.setting,
				itemEvents
			)
			if (!newNode) return
			setNodes((nds) => nds.concat(newNode as any))
		},
		[reactFlowInstance]
	)

	const onDragOver = useCallback((event: any) => {
		event.preventDefault()
		event.dataTransfer.dropEffect = 'move'
	}, [])

	const onConnect = useCallback((params: any) => {
		connectingNodeId.current = null
		let sourceNode: any = null
		setNodes((nds) => {
			sourceNode = nds.find((node) => node.id === params.source)
			return nds
		})

		// Get the source node
		if (!sourceNode) {
			console.error(`[FlowBuilder] Node ${params.source} not found`)
			return
		}

		// get source node background color
		const background = sourceNode?.data?.background
		setEdges((eds) =>
			addEdge({ ...params, data: { label: '<条件>' }, type: 'custom', ...getEdgeStyle(background) }, eds)
		)
	}, [])

	const onConnectStart = useCallback((_: any, { nodeId }: any) => {
		connectingNodeId.current = nodeId
	}, [])

	const { setHideContextMenu } = useFlowContext()
	return (
		<div className='reactflow-wrapper' ref={reactFlowWrapper}>
			<ReactFlow
				nodes={nodes}
				edges={edges}
				onInit={setReactFlowInstance}
				onPaneClick={() => {
					setHideContextMenu && setHideContextMenu(true)
				}}
				onNodesChange={onNodesChange}
				onEdgesChange={onEdgesChange}
				onDrop={onDrop}
				onDragOver={onDragOver}
				onConnect={onConnect}
				onConnectStart={onConnectStart}
				fitView
				fitViewOptions={{ maxZoom: 1 }}
				nodeOrigin={[0.5, 0]}
				snapToGrid
				edgeTypes={edgeTypes}
				nodeTypes={nodeTypes}
			>
				<Background gap={[14, 14]} />
				<Controls />
			</ReactFlow>
		</div>
	)
}

const Index = (props: IProps) => {
	return (
		<div className={clsx(styles._local)} style={{ height: props.height - 24, width: props.width }}>
			<div className='providerflow'>
				<ReactFlowProvider>
					<FlowProvider setting={props.setting}>
						<Flow {...props} />
					</FlowProvider>
				</ReactFlowProvider>
			</div>
		</div>
	)
}

export default window.$app.memo(Index)
