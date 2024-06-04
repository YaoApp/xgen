import clsx from 'clsx'
import ReactFlow, { Background, Controls, EdgeTypes, ReactFlowInstance, ReactFlowProvider } from 'reactflow'
import { useCallback, useRef, useState } from 'react'
import CustomEdge from './Edge'

import CustomNode from './Node'
import { FlowNode, FlowValue, PresetItem } from '../../types'
import { useBuilderContext } from '../Builder/Provider'

import 'reactflow/dist/style.css'
import styles from './index.less'
import { CreateID } from '../../utils'
import { message } from 'antd'
interface IProps {
	name?: string
	width: number
	height: number
	value?: FlowValue
	__namespace?: string
	__bind?: string

	onClick?: (event: any) => void
}

const edgeTypes: EdgeTypes = {
	custom: CustomEdge
}

const nodeTypes = {
	custom: CustomNode
}

const Flow = (props: IProps) => {
	const {
		is_cn,
		edges,
		nodes,
		setNodes,
		setEdges,
		EdgeStyle,
		onNodesChange,
		onEdgesChange,
		onSettingEdge,

		CreateNode,
		setHideContextMenu,
		onConnect,
		onConnectStart,
		onConnectEnd
	} = useBuilderContext()
	const { __namespace, __bind, name } = props
	const [reactFlowInstance, setReactFlowInstance] = useState<ReactFlowInstance | null>(null)
	const reactFlowWrapper = useRef(null)
	const onDrop = useCallback(
		(event: any) => {
			event.preventDefault()
			// Preset
			const preset = event.dataTransfer.getData('application/reactflow/preset')
			if (preset) {
				try {
					const presetObj = JSON.parse(preset)
					dropPreset(event, presetObj)
				} catch (error: any) {
					message.error(' Error: ' + error?.message || 'Unknown error')
				}
				return
			}

			// Type of Node
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

	const dropPreset = (event: any, preset: PresetItem) => {
		const offset = reactFlowInstance?.screenToFlowPosition({
			x: event.clientX,
			y: event.clientY
		})
		if (!offset) return

		const nameMappping: { [key: string]: any } = {}

		// Add Nodes to Flow
		const nodes: any[] = preset.nodes.map((node) => {
			const newNode = CreateNode(
				node.type,
				node.props?.description || node.type,
				{
					x: offset.x + node.position.x,
					y: offset.y + node.position.y
				},
				node.props
			)
			if (node.props?.name) {
				nameMappping[node.props?.name] = newNode
			}
			return newNode
		})

		// Add Edges to Flow
		const edges = preset.edges?.map((edge) => {
			const source = nameMappping[edge.source]
			const target = nameMappping[edge.target]

			if (!source || !target) return null
			const background = source?.data?.background
			const style = EdgeStyle(background)

			return {
				id: CreateID(),
				source: source.id,
				data: edge.data,
				...style,
				target: target.id,
				type: 'custom'
			}
		})

		setNodes((nds) => nds.concat(nodes))
		if (edges) setEdges((eds) => eds.concat(edges))
	}

	const onDragOver = useCallback((event: any) => {
		event.preventDefault()
		event.dataTransfer.dropEffect = 'move'
	}, [])

	return (
		<div className='reactflow-wrapper' ref={reactFlowWrapper}>
			<ReactFlow
				nodes={nodes?.map((node) => {
					if (!node.data) return node
					node.dragHandle = '.item-drag-handle'
					return node
				})}
				edges={edges}
				onInit={setReactFlowInstance}
				onPaneClick={() => setHideContextMenu && setHideContextMenu(true)}
				onNodesChange={onNodesChange}
				onEdgesChange={onEdgesChange}
				onDrop={onDrop}
				onDragOver={onDragOver}
				onConnect={onConnect}
				onConnectStart={onConnectStart}
				onConnectEnd={onConnectEnd}
				onEdgeClick={(event, edge) => onSettingEdge(edge)}
				fitView
				fitViewOptions={{ maxZoom: 1 }}
				nodeOrigin={[0.5, 0]}
				snapToGrid
				edgeTypes={edgeTypes}
				nodeTypes={nodeTypes}
			>
				<Background gap={[14, 14]} id={CreateID()} />
				<Controls />
			</ReactFlow>
		</div>
	)
}

const Index = (props: IProps) => {
	const { removeAttribution } = useBuilderContext()
	return (
		<div
			className={clsx(
				...(removeAttribution ? [styles._local, styles._removeAttribution] : [styles._local])
			)}
			style={{ height: props.height - 24, width: props.width }}
		>
			<div className='providerflow'>
				<ReactFlowProvider>
					<Flow {...props} />
				</ReactFlowProvider>
			</div>
		</div>
	)
}

export default window.$app.memo(Index)
