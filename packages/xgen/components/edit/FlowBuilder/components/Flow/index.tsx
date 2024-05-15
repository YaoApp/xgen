import Preset from '@/components/edit/FormBuilder/components/Preset'
import { Icon } from '@/widgets'
import { Button } from 'antd'

import styles from './index.less'
import clsx from 'clsx'
import ReactFlow, {
	Background,
	Controls,
	Edge,
	EdgeTypes,
	MarkerType,
	ReactFlowProvider,
	Viewport,
	addEdge,
	updateEdge,
	useEdgesState,
	useNodesState,
	useReactFlow,
	useStore
} from 'reactflow'
import { useCallback, useRef } from 'react'
import CustomEdge from './Edge'

import 'reactflow/dist/style.css'
import CustomNode from './Node'

interface IProps {
	name?: string
	width: number
	height: number
}

const edgeTypes: EdgeTypes = {
	custom: CustomEdge
}

const nodeTypes = {
	custom: CustomNode
}

const Flow = (props: IProps) => {
	const initialNodes: any[] = [
		{
			id: '1',
			type: 'custom',
			sourcePosition: 'right',
			targetPosition: 'left',
			className: 'default',
			data: {
				showTargetHandle: false,
				description: `这是根节点, 可以添加你的节点，对接后台数据`,
				icon: { name: 'material-business', size: 16 }
			},
			position: { x: 0, y: 0 }
		}
	]

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
	const reactFlowWrapper = useRef(null)
	const connectingNodeId = useRef(null)
	const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes)
	const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges)
	const { screenToFlowPosition } = useReactFlow()

	const onConnect = useCallback((params: any) => {
		connectingNodeId.current = null
		setEdges((eds) =>
			addEdge({ ...params, data: { label: '<条件>' }, type: 'custom', ...getEdgeStyle('default') }, eds)
		)
	}, [])

	const onConnectStart = useCallback((_: any, { nodeId }: any) => {
		connectingNodeId.current = nodeId
	}, [])

	const onConnectEnd = useCallback(
		(event: any) => {
			if (!connectingNodeId.current) return
			const targetIsPane = event.target.classList.contains('react-flow__pane')
			if (targetIsPane) {
				// we need to remove the wrapper bounds, in order to get the correct position
				const id = getId()
				const newNode: any = {
					id,
					type: 'custom',
					position: screenToFlowPosition({
						x: event.clientX,
						y: event.clientY
					}),
					className: 'primary',
					sourcePosition: 'right',
					targetPosition: 'left',
					data: {
						description: `${props.name} Node ${id}`,
						icon: 'material-psychology'
					},
					origin: [0.5, 0.0]
				}

				setNodes((nds) => nds.concat(newNode))
				setEdges((eds: any[]) => {
					return eds.concat({
						id,
						source: connectingNodeId.current,
						data: { label: '<条件>' },
						target: id,
						type: 'custom',
						...getEdgeStyle('primary')
					})
				})
			}
		},
		[screenToFlowPosition]
	)

	return (
		<div className='reactflow-wrapper' ref={reactFlowWrapper}>
			<ReactFlow
				nodes={nodes}
				edges={edges}
				onNodesChange={onNodesChange}
				onEdgesChange={onEdgesChange}
				onConnect={onConnect}
				onConnectStart={onConnectStart}
				onConnectEnd={onConnectEnd}
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
