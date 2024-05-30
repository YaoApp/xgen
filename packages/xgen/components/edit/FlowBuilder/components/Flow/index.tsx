import clsx from 'clsx'
import ReactFlow, { Background, Controls, EdgeTypes, ReactFlowInstance, ReactFlowProvider } from 'reactflow'
import { useCallback, useRef, useState } from 'react'
import CustomEdge from './Edge'

import CustomNode from './Node'
import { FlowValue } from '../../types'
import { useBuilderContext } from '../Builder/Provider'

import 'reactflow/dist/style.css'
import styles from './index.less'
interface IProps {
	name?: string
	width: number
	height: number
	value?: FlowValue
	__namespace?: string
	__bind?: string
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

	return (
		<div className='reactflow-wrapper' ref={reactFlowWrapper}>
			<ReactFlow
				nodes={nodes}
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
				<Background gap={[14, 14]} id={`${__namespace}.${__bind}.${name}`} />
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
