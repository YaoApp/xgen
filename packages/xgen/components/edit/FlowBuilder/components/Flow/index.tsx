import Preset from '@/components/edit/FormBuilder/components/Preset'
import { Icon } from '@/widgets'
import { Button } from 'antd'

import styles from './index.less'
import clsx from 'clsx'
import ReactFlow, {
	Background,
	Controls,
	Edge,
	MarkerType,
	ReactFlowProvider,
	Viewport,
	addEdge,
	useEdgesState,
	useNodesState,
	useReactFlow,
	useStore
} from 'reactflow'
import { useCallback, useRef } from 'react'

import 'reactflow/dist/style.css'
import { right } from '@antv/x6/lib/registry/port-layout/line'

interface IProps {
	name?: string
	width: number
	height: number
}

const Flow = (props: IProps) => {
	const initialNodes: any[] = [
		{
			id: '1',
			type: 'input',
			sourcePosition: 'right',
			targetPosition: 'left',
			className: 'default',
			data: {
				label: (
					<div className='flex align_center'>
						<Icon name='material-psychology' style={{ marginRight: 4 }} size={16} />
						<div
							style={{ textAlign: 'left' }}
						>{`发送 HTTP 请求到微博请求到微博请求到微博请求到微博请求到微博请`}</div>
					</div>
				)
			},
			position: { x: 0, y: 50 }
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

		console.log('color:', color)
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
		// reset the start node on connections
		connectingNodeId.current = null
		setEdges((eds) => addEdge({ ...params, ...getEdgeStyle('default') }, eds))
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
					position: screenToFlowPosition({
						x: event.clientX,
						y: event.clientY
					}),
					className: 'primary',
					sourcePosition: 'right',
					targetPosition: 'left',
					data: {
						label: (
							<div className='flex align_center'>
								<Icon name='material-psychology' style={{ marginRight: 4 }} size={16} />
								<div style={{ textAlign: 'left' }}>{`${props.name} Node ${id}`}</div>
							</div>
						)
					},
					origin: [0.5, 0.0]
				}

				setNodes((nds) => nds.concat(newNode))
				setEdges((eds: any[]) => {
					return eds.concat({
						id,
						source: connectingNodeId.current,
						target: id,
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
			>
				<Background />
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
