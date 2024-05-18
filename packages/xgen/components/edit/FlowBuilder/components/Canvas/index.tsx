import Preset from '@/components/edit/FormBuilder/components/Preset'
import { Icon, Panel } from '@/widgets'
import Flow from '../Flow'
import { useState } from 'react'
import { FlowValue, Type } from '../../types'
import { IconName, IconSize } from '../../utils'
import { getLocale } from '@umijs/max'
import { Node as ReactFlowNode } from 'reactflow'
import { useBuilderContext } from '../Builder/Provider'

interface IProps {
	width: number
	height: number
	value?: FlowValue
	showSidebar: boolean
	fixed: boolean
	offsetTop: number
	toggleSidebar: () => void
	onDataChange?: (data: any) => void
}

const Index = (props: IProps) => {
	if (props.width === 0) return null

	const { is_cn, setting, panelData, setPanelData, openPanel, setOpenPanel } = useBuilderContext()

	const defaultLabel = is_cn ? '未命名' : 'Untitled'

	// Panel setting
	const [type, setType] = useState<Type | undefined>(undefined)
	const [active, setActive] = useState<string | undefined>(undefined)
	const [updateData, setUpdateData] = useState<{ id: string; bind: string; value: any } | undefined>(undefined)

	const onPanelChange = (id: string, bind: string, value: any) => {
		setUpdateData(() => ({ id, bind, value }))
		setPanelData((prev: any) => {
			prev.props = { ...prev.props, [bind]: value }
			if (bind == 'description') {
				prev.description = value
			}
			return { ...prev }
		})
	}

	const hidePanel = () => {
		setOpenPanel(false)
		setActive(undefined)
	}

	const showPanel = (node: ReactFlowNode<any>) => {
		console.log('show-panel', node.id)

		const type = setting?.types?.find((item) => item.name === node.data?.type)
		if (!type) return console.error('Type not found', node)

		type.props?.forEach((section) => {
			section?.columns?.forEach((item) => {
				const component = setting?.fields?.[item.name]
				if (!component) return console.error('Component not found', item.name)
				item.component = component
			})
		})

		setPanelData(() => ({ ...node.data, props: { description: node.data?.description, ...node.data.props } }))
		setType(() => type)
		setActive(() => node.id)
		setOpenPanel(() => true)
	}

	return (
		<>
			<Panel
				open={openPanel}
				onClose={hidePanel}
				onChange={onPanelChange}
				id={active}
				label={panelData?.label || panelData?.description || panelData?.name || defaultLabel}
				defaultIcon='material-trip_origin'
				data={{ ...(panelData.props || {}) }}
				type={type}
				fixed={props.fixed}
				offsetTop={props.offsetTop}
				width={460}
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
							name={IconName(props.value?.icon)}
							size={IconSize(props.value?.icon)}
							style={{ marginRight: 4 }}
						/>
						{props.value?.label || props.value?.name || defaultLabel}
					</div>
					<div className='actions'>
						<a style={{ marginRight: 12, marginTop: 2 }}>
							<Icon name='icon-play' size={14} />
						</a>
						<a style={{ marginRight: 6, marginTop: 2 }}>
							<Icon name='icon-settings' size={14} />
						</a>
						<Preset />
					</div>
				</div>

				<Flow
					width={props.width}
					height={props.height}
					value={props.value}
					openPanel={showPanel}
					updateData={updateData}
					onDataChange={props.onDataChange}
				/>
			</div>
		</>
	)
}

export default window.$app.memo(Index)
