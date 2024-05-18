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
	useReactFlow,
	Node as ReactFlowNode
} from 'reactflow'
import { useCallback, useEffect, useRef, useState } from 'react'
import CustomEdge from './Edge'

import 'reactflow/dist/style.css'
import CustomNode from './Node'
import { FlowValue } from '../../types'
import { useBuilderContext } from '../Builder/Provider'

interface IProps {
	name?: string
	width: number
	height: number
	value?: FlowValue
}

const edgeTypes: EdgeTypes = {
	custom: CustomEdge
}

const nodeTypes = {
	custom: CustomNode
}

const Flow = (props: IProps) => {
	const { CreateNode, setHideContextMenu, is_cn, nodes, setNodes, onNodesChange, edges, setEdges, onEdgesChange } =
		useBuilderContext()

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

	const [reactFlowInstance, setReactFlowInstance] = useState<ReactFlowInstance | null>(null)
	const reactFlowWrapper = useRef(null)
	const connectingNodeId = useRef(null)

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
			const newNode = CreateNode(type, description, { x: position?.x, y: position?.y })
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
					<Flow {...props} />
				</ReactFlowProvider>
			</div>
		</div>
	)
}

export default window.$app.memo(Index)
