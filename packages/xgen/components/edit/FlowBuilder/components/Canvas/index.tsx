import Preset from '@/components/edit/FormBuilder/components/Preset'
import { Icon, Panel } from '@/widgets'
import Flow from '../Flow'
import { FlowValue, Type } from '../../types'
import { IconName, IconSize } from '../../utils'
import { Node as ReactFlowNode } from 'reactflow'
import { useBuilderContext } from '../Builder/Provider'
import { useState } from 'react'

interface IProps {
	width: number
	height: number
	value?: FlowValue
	showSidebar: boolean
	fixed: boolean
	offsetTop: number
	toggleSidebar: () => void
}

const Index = (props: IProps) => {
	if (props.width === 0) return null
	const {
		is_cn,
		setting,
		panelNode,
		setPanelNode,
		value,
		setValue,
		openPanel,
		setOpenPanel,
		setNodes,
		setUpdateData
	} = useBuilderContext()
	const defaultLabel = is_cn ? '未命名' : 'Untitled'

	const [openSettings, setOpenSettings] = useState(false)

	const onPanelChange = (id: string, bind: string, value: any) => {
		if (openSettings) {
			setValue?.((val) => {
				if (val?.flow) {
					val.flow[bind] = value
				}
				return { ...val }
			})
			return
		}

		setNodes((nds) => {
			const node = nds.find((item) => item.id === id)
			if (!node) return nds
			node.data.props[bind] = value
			return [...nds]
		})

		setUpdateData((data: any) => ({ id, bind, value }))
	}

	const hidePanel = () => {
		setOpenPanel(() => false)
	}

	const afterOpenChange = (open: boolean) => {
		if (!open) {
			setOpenSettings(() => false)
			setPanelNode(() => undefined)
		}
	}

	const getType = () => {
		if (openSettings) return getSetting()
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

	const getSetting = () => {
		if (!setting) return undefined
		if (!setting.flow) {
			console.error('Flow not found')
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

	const getLabel = () => {
		if (openSettings) return is_cn ? '设置' : 'Settings'
		return (
			panelNode?.data?.props?.label ||
			panelNode?.data?.props?.description ||
			panelNode?.data?.props?.name ||
			defaultLabel
		)
	}

	const getData = () => {
		if (openSettings) return { ...(value?.flow || {}) }
		return { ...(panelNode?.data?.props || {}) }
	}

	const getID = () => {
		if (openSettings) return '__settings'
		return panelNode?.id
	}

	const showSettings = () => {
		setOpenSettings(() => true)
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
						<a style={{ marginRight: 12, marginTop: 2 }}>
							<Icon name='icon-play' size={14} />
						</a>
						<a style={{ marginRight: 6, marginTop: 2 }} onClick={showSettings}>
							<Icon name='icon-settings' size={14} />
						</a>
						<Preset />
					</div>
				</div>

				<Flow width={props.width} height={props.height} value={props.value} />
			</div>
		</>
	)
}

export default window.$app.memo(Index)
