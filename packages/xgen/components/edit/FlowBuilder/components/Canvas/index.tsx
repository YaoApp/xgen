import Preset from '@/components/edit/FormBuilder/components/Preset'
import { Icon, Panel } from '@/widgets'
import Flow from '../Flow'
import { FlowValue } from '../../types'
import { IconName, IconSize } from '../../utils'
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
}

const Index = (props: IProps) => {
	if (props.width === 0) return null
	const { is_cn, setting, panelNode, setPanelNode, openPanel, setOpenPanel, setNodes, setUpdateData } =
		useBuilderContext()
	const defaultLabel = is_cn ? '未命名' : 'Untitled'

	const onPanelChange = (id: string, bind: string, value: any) => {
		setNodes((nds) => {
			const node = nds.find((item) => item.id === id)
			if (!node) return nds
			node.data.props[bind] = value
			return [...nds]
		})

		setUpdateData((data: any) => ({ id, bind, value }))
	}

	const hidePanel = () => {
		setOpenPanel(false)
	}

	const getType = (node: ReactFlowNode<any> | undefined) => {
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

	return (
		<>
			<Panel
				open={openPanel}
				onClose={hidePanel}
				onChange={onPanelChange}
				id={panelNode?.id}
				label={
					panelNode?.data?.props?.label ||
					panelNode?.data?.props?.description ||
					panelNode?.data?.props?.name ||
					defaultLabel
				}
				defaultIcon='material-trip_origin'
				data={{ ...(panelNode?.data?.props || {}) }}
				type={getType(panelNode)}
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
						<a style={{ marginRight: 6, marginTop: 2 }}>
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
