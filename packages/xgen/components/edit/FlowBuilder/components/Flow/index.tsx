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
	ReactFlowInstance,
	ReactFlowProvider,
	Viewport,
	addEdge,
	updateEdge,
	useEdgesState,
	useNodesState,
	useReactFlow,
	useStore
} from 'reactflow'
import { useCallback, useRef, useState } from 'react'
import CustomEdge from './Edge'

import 'reactflow/dist/style.css'
import CustomNode from './Node'
import { FlowValue, Setting } from '../../types'
import { CreateNode, ID, Nodes } from './utils'
import { getLocale } from '@umijs/max'

interface IProps {
	name?: string
	width: number
	height: number
	setting?: Setting
	value?: FlowValue
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

	const onAdd = useCallback((id: string) => {
		console.log('add', id)
	}, [])

	const onSetting = useCallback((id: string) => {
		console.log('setting', id)
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
					className: id == '2' ? 'primary' : 'default',
					sourcePosition: 'right',
					targetPosition: 'left',
					data: {
						color: id == '2' ? 'primary' : '#FF6600',
						running: id == '2' ? true : false,
						type: 'AI 提取数据',
						error: id != '2' ? '出错啦！ 请检查 ...' : undefined,
						description: `${props.name} Node ${id}`,
						icon: id == '2' ? 'material-psychology' : ''
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
				onInit={setReactFlowInstance}
				onNodesChange={onNodesChange}
				onEdgesChange={onEdgesChange}
				onDrop={onDrop}
				onDragOver={onDragOver}
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
