import { Icon } from '@/widgets'
import { IconName } from '../../utils'
import type { Component } from '@/types'
import Builder from '../Builder'
import { FlowTab, FlowValue } from '../../types'
import { Dispatch, SetStateAction } from 'react'

interface ITabProps {
	setting?: any
	width?: number
	height?: number
	isFixed?: boolean
	fullscreen: boolean
	setFullscreen: (value: boolean) => void
	showSidebar?: boolean
	offsetTop?: number
	index: number
	is_cn?: boolean

	removeAttribution?: boolean
	execute?: Component.Request
	presets?: Component.Request
	flowValue: FlowValue
	onData: (id: string, type: string, value: any) => void
	toggleSidebar: () => void

	showMask: boolean
	setShowMask: Dispatch<SetStateAction<boolean>>
}

interface IProps extends Component.PropsEditComponent, ITabProps {}

const Label = (props: { text: string; icon: string }) => {
	return (
		<div
			className='flex'
			style={{
				alignItems: 'center',
				justifyContent: 'center',
				fontSize: 14
			}}
		>
			<Icon size={16} name={props.icon} />
			<div style={{ marginLeft: 4 }}>{props.text}</div>
		</div>
	)
}

export const Tab = (props: IProps): FlowTab | null => {
	const { __namespace, __bind } = props
	const {
		flowValue,
		setting,
		onData,
		width,
		is_cn,
		height,
		isFixed,
		offsetTop,
		showSidebar,
		index,
		toggleSidebar
	} = props
	let { flow } = flowValue || {}
	if (!flow) {
		flow = { name: '未命名', label: '未命名', icon: 'material-trip_origin' }
	}

	const text = is_cn ? '<未命名>' : '<Untitled>'
	if (!flow.id) flow.id = `${__namespace}-${__bind}-${flow.name || flow.label || text}-${index}`
	return {
		id: flow.id,
		key: flow.id,
		width,
		height,
		isFixed,
		showSidebar,
		label: <Label text={flow?.label || flow?.name || ''} icon={IconName(flow?.icon)} />,
		value: { ...flowValue, id: flow.id },
		closable: flow?.deletable === undefined || flow.deletable === true,
		children: (
			<Builder
				id={flow.id}
				name={flow.name}
				execute={props.execute}
				presets={props.presets}
				width={width || 0}
				height={height || 0}
				fixed={isFixed === undefined ? false : isFixed}
				offsetTop={offsetTop || 0}
				showSidebar={showSidebar === undefined ? true : showSidebar}
				setting={setting}
				value={flowValue}
				toggleSidebar={toggleSidebar}
				onData={onData}
				__namespace={__namespace}
				__bind={__bind}
				fullscreen={props.fullscreen}
				setFullscreen={props.setFullscreen}
				removeAttribution={props.removeAttribution}
				showMask={props.showMask}
				setShowMask={props.setShowMask}
			/>
		)
	}
}

export default Tab
