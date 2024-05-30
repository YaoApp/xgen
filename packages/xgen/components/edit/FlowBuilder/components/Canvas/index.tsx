import Preset from '@/components/edit/FormBuilder/components/Preset'
import { Icon, Panel } from '@/widgets'
import Flow from '../Flow'
import { FlowValue, Type } from '../../types'
import { IconName, IconSize } from '../../utils'
import { Node as ReactFlowNode } from 'reactflow'
import { useBuilderContext } from '../Builder/Provider'
import { useState } from 'react'

import yaml from 'js-yaml'
import { Button, message } from 'antd'

interface IProps {
	width: number
	height: number
	value?: FlowValue
	showSidebar: boolean
	fixed: boolean
	offsetTop: number

	id: string
	name?: string
	__namespace?: string
	__bind?: string
	toggleSidebar: () => void
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

		value,
		openPanel,
		setOpenPanel,
		running,
		setRunning,
		openSettings,
		setOpenSettings,
		openExecute,
		setOpenExecute,
		openEdge,
		setOpenEdge,
		onPanelChange
	} = useBuilderContext()

	const defaultLabel = is_cn ? '未命名' : 'Untitled'

	const hidePanel = () => {
		setOpenPanel(() => false)
	}

	const afterOpenChange = (open: boolean) => {
		if (!open) {
			setOpenSettings(() => false)
			setOpenExecute(() => false)
			setOpenEdge(() => false)
			setPanelNode(() => undefined)
			setPanelEdge(() => undefined)
		}
	}

	const getType = () => {
		if (openSettings) return getSetting()
		if (openExecute) return getExecute()
		if (openEdge) return getEdge()

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
			name: getEdgeName(),
			icon: 'material-conversion_path',
			props: setting.edge
		} as Type
	}

	const getEdgeName = () => {
		if (!panelEdge) return defaultLabel

		const sourceId = panelEdge?.source
		const targetId = panelEdge?.target
		const source = value?.nodes?.find((node) => node.id === sourceId)
		const target = value?.nodes?.find((node) => node.id === targetId)

		const sourceType = setting?.types?.find((item) => item.name === source?.type)
		const targetType = setting?.types?.find((item) => item.name === target?.type)

		const sourceName =
			source?.props?.label || source?.props?.description || source?.props?.name || sourceType?.name
		const targetName =
			target?.props?.label || target?.props?.description || target?.props?.name || targetType?.name

		const name = `${is_cn ? '条件设定' : 'Condition Setting'} (${sourceName} -> ${targetName})`

		return name
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
			icon: 'icon-settings',
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
		if (openEdge) return getEdgeName()
		return (
			panelNode?.data?.props?.label ||
			panelNode?.data?.props?.description ||
			panelNode?.data?.props?.name ||
			defaultLabel
		)
	}

	const doExecute = () => {
		setRunning(() => true)
		setTimeout(() => {
			setRunning(() => false)
			message.success(is_cn ? '运行完毕' : 'Run Complete')
		}, 5000)
		console.log('doExecute', value)
	}

	const getActions = () => {
		if (!openExecute) return undefined
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

	const getData = () => {
		if (openSettings) return { ...(value?.flow || {}) }
		if (openExecute) return { ...(value?.execute || {}) }
		if (openEdge) {
			const edge = panelEdge
			if (!edge) return {}
			return { ...(edge?.data || {}) }
		}

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
		setOpenPanel(() => true)
	}

	const showExecute = () => {
		setOpenExecute(() => true)
		setOpenSettings(() => false)
		setOpenEdge(() => false)
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
				defaultIcon='material-trip_origin'
			/>
			<div style={{ width: props.width }}>
				<div className='head'>
					<div className='title'>
						<a
							onClick={props.toggleSidebar}
							style={{ marginRight: 6 }}
							className='flex align_center'
						>
							<Icon
								name={props.showSidebar ? 'material-first_page' : 'material-last_page'}
								size={18}
							/>
						</a>
						<Icon
							name={IconName(props.value?.flow?.icon)}
							size={IconSize(props.value?.flow?.icon)}
							style={{ marginRight: 4 }}
						/>
						{props.value?.flow?.label || props.value?.flow?.name || defaultLabel}
					</div>
					<div className='actions'>
						<a style={{ marginRight: 12, marginTop: 2 }} onClick={showExecute}>
							<Icon name='icon-play' size={14} />
						</a>
						<a style={{ marginRight: 6, marginTop: 2 }} onClick={showSettings}>
							<Icon name='icon-settings' size={14} />
						</a>
						<Preset />
					</div>
				</div>

				<Flow
					width={props.width}
					height={props.height}
					value={props.value}
					name={props.name}
					__namespace={props.__namespace}
					__bind={props.__bind}
				/>
			</div>
		</>
	)
}

export default window.$app.memo(Index)
