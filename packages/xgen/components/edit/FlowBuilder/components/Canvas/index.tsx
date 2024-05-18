import Preset from '@/components/edit/FormBuilder/components/Preset'
import { Icon, Panel } from '@/widgets'
import { Button } from 'antd'
import Flow from '../Flow'
import { useState } from 'react'
import { FlowValue, Setting, Type } from '../../types'
import { IconName, IconSize } from '../../utils'
import { getLocale } from '@umijs/max'
import { Node as ReactFlowNode } from 'reactflow'

interface IProps {
	width: number
	height: number
	value?: FlowValue
	showSidebar: boolean
	fixed: boolean
	offsetTop: number
	setting?: Setting
	toggleSidebar: () => void
}

const Index = (props: IProps) => {
	if (props.width === 0) return null
	if (!props.setting) return null

	const is_cn = getLocale() === 'zh-CN'
	const defaultLabel = is_cn ? '未命名' : 'Untitled'

	// Panel setting
	const [open, setOpen] = useState(false)
	const [type, setType] = useState<Type | undefined>(undefined)
	const [active, setActive] = useState<string | undefined>(undefined)
	const [node, setNode] = useState<ReactFlowNode<any> | undefined>(undefined)
	const hidePanel = () => {
		setOpen(false)
		setActive(undefined)
	}
	const onPanelChange = (id: string, bind: string, value: any) => {}
	const showPanel = (node: ReactFlowNode<any>) => {
		const type = props.setting?.types?.find((item) => item.name === node.data?.type)
		if (!type) return console.error('Type not found', node)

		type.props?.forEach((section) => {
			section?.columns?.forEach((item) => {
				const component = props.setting?.fields?.[item.name]
				if (!component) return console.error('Component not found', item.name)
				item.component = component
			})
		})

		setNode(node)
		setType(type)
		setActive(node.id)
		setOpen(true)
	}

	return (
		<>
			<Panel
				open={open}
				onClose={hidePanel}
				onChange={onPanelChange}
				id={active}
				label={node?.data?.label || node?.data?.description || node?.data?.name || defaultLabel}
				defaultIcon='material-trip_origin'
				data={{
					...(node?.data?.props || {}),
					description: node?.data?.description || node?.data?.name || defaultLabel
				}}
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
					setting={props.setting}
					value={props.value}
					openPanel={showPanel}
				/>
			</div>
		</>
	)
}

export default window.$app.memo(Index)
