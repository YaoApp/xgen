import React, { useCallback } from 'react'
import { Dispatch, ReactNode, SetStateAction, createContext, useContext, useState } from 'react'
import { FlowNode, FlowValue, Setting } from '../../../types'
import { useEdgesState, useNodesState, Node as ReactFlowNode, OnNodesChange, OnEdgesChange } from 'reactflow'
import { getLocale } from '@umijs/max'

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
	onSetting: (id: string) => void

	value?: FlowValue
	setValue?: Dispatch<SetStateAction<FlowValue | undefined>>

	CreateNode: (typeName: string, description: string, position: { x: number; y: number }) => any

	panelNode: ReactFlowNode<any> | undefined
	setPanelNode: Dispatch<SetStateAction<ReactFlowNode<any> | undefined>>

	openPanel: boolean
	setOpenPanel: Dispatch<SetStateAction<boolean>>

	updateData: any | undefined
	setUpdateData: Dispatch<SetStateAction<any | undefined>>

	running: boolean
	setRunning: Dispatch<SetStateAction<boolean>>
}

interface IProps {
	children: ReactNode
	setting?: Setting
	value?: FlowValue
}

const BuilderContext = createContext<BuilderContextType | undefined>(undefined)
export const BuilderProvider: React.FC<IProps> = (props) => {
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

	const CreateNode = (typeName: string, description: string, position: { x: number; y: number }) => {
		const nodeType = setting?.types?.find((type) => type.name === typeName)
		if (!nodeType) {
			console.error(`[FlowBuilder] Node type ${typeName} not found`)
			return
		}

		const node: FlowNode = {
			id: ID(),
			type: typeName,
			props: { description: description },
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
		if (id === undefined) return `${Date.now()}${Math.random()}`
		if (typeof id === 'number') return `${id}`
		return id
	}

	const is_cn = getLocale() === 'zh-CN'
	const [value, setValue] = useState<FlowValue | undefined>(props.value)
	const [setting, setSetting] = useState<Setting | undefined>(props.setting)
	const [hideContextMenu, setHideContextMenu] = useState<boolean | undefined>(undefined)
	const [nodes, setNodes, onNodesChange] = useNodesState(Nodes(value))
	const [edges, setEdges, onEdgesChange] = useEdgesState([])
	const [running, setRunning] = useState(false)

	const [openPanel, setOpenPanel] = useState(false)
	const [panelNode, setPanelNode] = useState<ReactFlowNode<any> | undefined>(undefined)
	const [updateData, setUpdateData] = useState<any | undefined>(undefined)

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
			const newNode = CreateNode(type, description, { x: position?.x, y: position?.y })
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
			data.props = { ...data.props, description: `[${is_cn ? '复本' : 'Copy'}] ${data.props?.description}` }
			const newNode = {
				...node,
				id: newID,
				data: { ...data, id: newID },
				position: position
			}
			return nds.concat(newNode as any)
		})
	}, [])

	const onSetting = useCallback((id: string) => {
		setNodes((nds: any) => {
			const node = nds.find((n: any) => {
				n.selected = false // unselect all nodes
				return n.id === id
			})
			if (!node) {
				console.error(`[FlowBuilder] Node ${id} not found`)
				return
			}
			node.selected = true // select the node
			setPanelNode(() => node)
			setOpenPanel(() => true)
			return nds
		})
	}, [])

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
				setEdges,
				onNodesChange,
				onEdgesChange,

				onDelete,
				onAdd,
				onDuplicate,
				onSetting,
				is_cn,

				value,
				setValue,
				CreateNode,

				panelNode,
				setPanelNode,
				openPanel,
				setOpenPanel,

				updateData,
				setUpdateData,

				running,
				setRunning
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
