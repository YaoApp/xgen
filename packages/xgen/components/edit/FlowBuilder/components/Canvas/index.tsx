import { Icon, Panel, PanelPresets as Presets, PanelFilter as Filter } from '@/widgets'
import Flow from '../Flow'
import { FlowValue, Type } from '../../types'
import { Execute, IconName, IconSize } from '../../utils'
import { useBuilderContext } from '../Builder/Provider'

import { Button, Tooltip, message } from 'antd'
import { useEffect, useState } from 'react'

interface IProps {
	width: number
	height: number
	value?: FlowValue
	fixed: boolean
	offsetTop: number

	id: string
	name?: string
	__namespace?: string
	__bind?: string
}

const Index = (props: IProps) => {
	if (props.width === 0) return null
	const {
		is_cn,
		setting,
		panelNode,
		setPanelNode,
		panelEdge,
		setPanelEdge,
		execute,
		presets,

		value,
		nodes,
		setNodes,
		setEdges,
		openPanel,
		setOpenPanel,
		showMask,
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
		fullscreen,
		setFullscreen
	} = useBuilderContext()

	const [keywords, setKeywords] = useState<string>('')

	const defaultLabel = is_cn ? '未命名' : 'Untitled'

	const hidePanel = () => {
		setOpenPanel(() => false)
		setShowMask(() => true)

		if (panelNode) {
			setNodes((nodes) => {
				return nodes.map((node) => {
					if (node.id === panelNode.id) {
						node.selected = false
					}
					return node
				})
			})
		}

		if (panelEdge) {
			setEdges((edges) => {
				return edges.map((edge) => {
					if (edge.id === panelEdge.id) {
						edge.selected = false
					}
					return edge
				})
			})
		}
	}

	const afterOpenChange = (open: boolean) => {
		if (!open) {
			setOpenSettings(() => false)
			setOpenExecute(() => false)
			setOpenEdge(() => false)
			setOpenPresets(() => false)
			setPanelNode(() => undefined)
			setPanelEdge(() => undefined)
		}
	}

	const getType = () => {
		if (openSettings) return getSetting()
		if (openExecute) return getExecute()
		if (openEdge) return getEdge()
		if (openPresets) return undefined

		const node = panelNode
		if (!node) return undefined
		const type = setting?.types?.find((item) => item.name === node.data?.type)
		if (!type) {
			console.error('Type not found', node)
			return undefined
		}

		type.props?.forEach((section) => {
			section?.columns?.forEach((item) => {
				const component = setting?.fields?.[item.name]
				if (!component) return console.error('Component not found', item.name)
				item.component = component
			})
		})
		return type
	}

	const getEdge = () => {
		if (!openEdge) return undefined
		if (!setting) return undefined
		if (!setting.edge) {
			console.error('setting.edge not found')
			return undefined
		}

		setting.edge.forEach((section) => {
			section?.columns?.forEach((item) => {
				const component = setting?.fields?.[item.name]
				if (!component) return console.error('Component not found', item.name)
				item.component = component
			})
		})

		return {
			icon: 'material-conversion_path',
			props: setting.edge
		} as Type
	}

	const getEdgeName = () => {
		if (!panelEdge) return { name: defaultLabel }
		const sourceId = panelEdge?.source
		const targetId = panelEdge?.target
		const source = nodes?.find((node) => node.id === sourceId)
		const target = nodes?.find((node) => node.id === targetId)
		const sourceProps = source?.data?.props || {}
		const targetProps = target?.data?.props || {}

		const sourceType = setting?.types?.find((item) => item.name === source?.data.type)
		const targetType = setting?.types?.find((item) => item.name === target?.data.type)

		const sourceName = sourceProps.label || sourceProps.description || sourceProps.name || sourceType?.name
		const targetName = targetProps.label || targetProps.description || targetProps.name || targetType?.name

		return {
			name: is_cn ? '条件设定' : 'Condition Setting',
			source: { name: sourceName, type: sourceType },
			target: { name: targetName, type: targetType }
		}
	}

	const getSetting = () => {
		if (!setting) return undefined
		if (!setting.flow) {
			console.error('setting.flow not found')
			return undefined
		}

		setting.flow.forEach((section) => {
			section?.columns?.forEach((item) => {
				const component = setting?.fields?.[item.name]
				if (!component) return console.error('Component not found', item.name)
				item.component = component
			})
		})

		return {
			name: is_cn ? '设置' : 'Settings',
			icon: 'icon-sliders',
			props: setting.flow
		} as Type
	}

	const getExecute = () => {
		if (!setting) return undefined
		if (!setting.execute) {
			console.error('setting.execute not found')
			return undefined
		}

		setting.execute.forEach((section) => {
			section?.columns?.forEach((item) => {
				const component = setting?.fields?.[item.name]
				if (!component) return console.error('Component not found', item.name)
				item.component = component
			})
		})

		return {
			name: is_cn ? '运行' : 'Execute',
			icon: 'icon-play',
			props: setting.execute
		} as Type
	}

	const getLabel = () => {
		if (openSettings) return is_cn ? '设置' : 'Settings'
		if (openExecute) return is_cn ? '运行' : 'Execute'
		if (openPresets) return is_cn ? '插入' : 'Insert'
		if (openEdge) return getEdgeLabel()
		return (
			panelNode?.data?.props?.label ||
			panelNode?.data?.props?.description ||
			panelNode?.data?.props?.name ||
			defaultLabel
		)
	}

	function getEdgeLabel() {
		const edge = getEdgeName()
		if (!edge) return defaultLabel
		const size = 12

		let sourceIcon = <Icon name='material-trip_origin' size={size} style={{ marginRight: 2 }} />
		if (typeof edge.source?.type?.icon === 'string') {
			sourceIcon = <Icon name={edge.source?.type?.icon} size={size} style={{ marginRight: 2 }} />
		}
		if (typeof edge.source?.type?.icon == 'object') {
			sourceIcon = (
				<Icon
					name={edge.source?.type?.icon?.name || 'material-trip_origin'}
					size={12}
					style={{ marginRight: 4 }}
				/>
			)
		}

		let targetIcon = <Icon name='material-trip_origin' size={size} style={{ marginRight: 2 }} />
		if (typeof edge.target?.type?.icon === 'string') {
			targetIcon = <Icon name={edge.target?.type?.icon} size={size} style={{ marginRight: 2 }} />
		}
		if (typeof edge.target?.type?.icon == 'object') {
			targetIcon = (
				<Icon
					name={edge.target?.type?.icon?.name || 'material-trip_origin'}
					size={size}
					style={{ marginRight: 4 }}
				/>
			)
		}

		return (
			<div
				style={{
					justifyContent: 'center',
					justifyItems: 'center',
					alignItems: 'center',
					display: 'flex'
				}}
			>
				<span className='mr_8'>{edge.name}</span>
				{sourceIcon}
				<span style={{ fontSize: size }}>{edge.source?.name}</span>
				<Icon name='material-arrow_forward' size={size} style={{ margin: '0 4px' }} />
				{targetIcon}
				<span style={{ fontSize: size }}>{edge.target?.name}</span>
			</div>
		)
	}

	const doExecute = () => {
		if (!execute) return undefined
		if (value === undefined) return undefined

		setRunning(() => true)
		Execute(execute, value, { __namespace: props.__namespace, __bind: props.__bind })
			.then((res) => {
				if (res.code != 200) {
					const msg = res.message || (is_cn ? '运行失败' : 'Run Failed')
					if (res.errors) {
						setNodes((nodes) => {
							return nodes.map((node) => {
								if (res.errors[node.id]) {
									node.data.error = res.errors[node.id]
								}
								return node
							})
						})
					}
					message.error(msg)
					return
				}

				// Remove Error
				setNodes((nodes) => {
					return nodes.map((node) => {
						node.data.error = undefined
						return node
					})
				})

				// @Todo: Display Result
				const msg = res.message || (is_cn ? '运行成功' : 'Run Success')
				message.success(msg)
			})
			.catch((err) => {
				message.error(is_cn ? '运行失败' : 'Run Failed')
			})
			.finally(() => {
				setRunning(() => false)
			})
	}

	const getActions = () => {
		if (openExecute) {
			return [
				<Button
					key='run'
					type='primary'
					loading={running}
					size='small'
					onClick={() => doExecute()}
					style={{ fontSize: 12 }}
				>
					<Icon name='icon-play' size={10} style={{ marginRight: 4 }} />
					{is_cn ? '运行' : 'Run'}
				</Button>
			]
		}

		if (openPresets) {
			return [<Filter key='filter' onChange={(value) => setKeywords(value)} />]
		}

		return undefined
	}

	const getData = () => {
		if (openSettings) return { ...(value?.flow || {}) }
		if (openExecute) return { ...(value?.execute || {}) }
		if (openEdge) {
			const edge = panelEdge
			if (!edge) return {}
			return { ...(edge?.data || {}) }
		}
		if (openPresets) return {}

		return { ...(panelNode?.data?.props || {}) }
	}

	const getID = () => {
		if (openSettings) return '__settings'
		if (openExecute) return '__execute'
		if (openEdge) return panelEdge?.id

		return panelNode?.id
	}

	const showSettings = () => {
		setOpenSettings(() => true)
		setOpenExecute(() => false)
		setOpenEdge(() => false)
		setOpenPresets(() => false)

		setShowMask(() => true)
		setOpenPanel(() => true)
	}

	const showExecute = () => {
		setOpenExecute(() => true)
		setOpenSettings(() => false)
		setOpenEdge(() => false)
		setOpenPresets(() => false)

		setShowMask(() => false)
		setOpenPanel(() => true)
	}

	const showPresets = () => {
		setOpenPresets(() => true)
		setOpenSettings(() => false)
		setOpenExecute(() => false)
		setOpenEdge(() => false)

		setShowMask(() => false)
		setOpenPanel(() => true)
	}

	return (
		<>
			<Panel
				open={openPanel}
				onClose={hidePanel}
				afterOpenChange={afterOpenChange}
				onChange={onPanelChange}
				id={getID()}
				actions={getActions()}
				label={getLabel()}
				data={getData()}
				type={getType()}
				fixed={props.fixed}
				offsetTop={props.offsetTop}
				width={460}
				mask={showMask}
				defaultIcon='material-trip_origin'
				icon={openPresets ? 'icon-plus-circle' : undefined}
				children={
					openPresets ? (
						<Presets
							keywords={keywords}
							transfer='application/reactflow/preset'
							__namespace={props.__namespace}
							__bind={props.__bind}
							presets={presets}
						/>
					) : undefined
				}
			/>
			<div className='title-bar' style={{ width: props.width }}>
				<div className='head'>
					<div className='title' onClick={showSettings}>
						<Icon
							name={IconName(props.value?.flow?.icon)}
							size={IconSize(props.value?.flow?.icon)}
							style={{ marginRight: 4 }}
						/>
						{props.value?.flow?.label || props.value?.flow?.name || defaultLabel}
					</div>
					<div className='actions'>
						<Tooltip
							title={is_cn ? '插入' : 'Insert'}
							placement={fullscreen ? 'bottom' : 'top'}
						>
							<a style={{ marginRight: 12, marginTop: 2 }} onClick={showPresets}>
								<Icon name='icon-plus-circle' size={16} />
							</a>
						</Tooltip>
						<Tooltip
							title={is_cn ? '运行' : 'Execute'}
							placement={fullscreen ? 'bottom' : 'top'}
						>
							<a style={{ marginRight: 12, marginTop: 2 }} onClick={showExecute}>
								<Icon name='icon-play' size={16} />
							</a>
						</Tooltip>

						<Tooltip
							title={is_cn ? '设置' : 'Settings'}
							placement={fullscreen ? 'bottom' : 'top'}
						>
							<a style={{ marginRight: 12, marginTop: 2 }} onClick={showSettings}>
								<Icon name='icon-sliders' size={16} />
							</a>
						</Tooltip>

						{!fullscreen ? (
							<Tooltip
								title={is_cn ? '全屏' : 'Full Screen'}
								placement={fullscreen ? 'bottom' : 'top'}
							>
								<a
									style={{ marginRight: 12, marginTop: 2 }}
									onClick={() => setFullscreen(true)}
								>
									<Icon name='icon-maximize' size={16} />
								</a>
							</Tooltip>
						) : (
							<Tooltip title={is_cn ? '退出全屏' : 'Exit Full Screen'} placement='bottom'>
								<a
									style={{ marginRight: 12, marginTop: 2 }}
									onClick={() => setFullscreen(false)}
								>
									<Icon name='icon-minimize' size={16} />
								</a>
							</Tooltip>
						)}
					</div>
				</div>

				<Flow
					width={props.width}
					height={props.height}
					value={props.value}
					name={props.name}
					__namespace={props.__namespace}
					__bind={props.__bind}
					onClick={(event) => {
						if (openPanel) {
							setOpenPanel(() => false)
						}
					}}
				/>
			</div>
		</>
	)
}

export default window.$app.memo(Index)
