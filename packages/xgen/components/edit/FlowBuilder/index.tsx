import { Skeleton, Tabs, message } from 'antd'
import type { Component } from '@/types'
import { Item } from '@/components'
import { useEffect, useRef, useState } from 'react'

import styles from './index.less'
import clsx from 'clsx'
import { Else, If, Then } from 'react-if'
import { Icon } from '@/widgets'
import { FlowValue, Setting } from './types'
import { GetSetting, GetValues, IconName } from './utils'
import { useGlobal } from '@/context/app'
import Builder from './components/Builder'
import { getLocale } from '@umijs/max'

interface IFlowBuilderProps {
	setting?: any
	presets?: any
	height?: number
	multiple?: boolean

	value: any
	disabled?: boolean

	label?: string
	bind?: string
	namespace?: string
	type?: string
	removeAttribution?: boolean
	onChange?: (v: any) => void
}

interface IProps extends Component.PropsEditComponent, IFlowBuilderProps {}

const FlowBuilder = window.$app.memo((props: IProps) => {
	const global = useGlobal()
	const is_cn = getLocale() === 'zh-CN'
	const ref = useRef<HTMLDivElement>(null)

	const [loading, setLoading] = useState<boolean>(false)
	const [setting, setSetting] = useState<Setting | undefined>(undefined)
	const [flows, setFlows] = useState<any[]>([])
	const [activeFlow, setActiveFlow] = useState<string>('')

	// Get the form value
	const [value, setValue] = useState<any>()
	useEffect(() => {
		setValue(props.value)
	}, [props.value])

	// Set the width of the grid layout
	const offsetTop = 80
	const [isFixed, setIsFixed] = useState(false)
	// Fixed sidebar, canvas and toolbar
	useEffect(() => {
		const handleScroll = () => {
			const top = ref.current?.getBoundingClientRect().top || 0
			const height = ref.current?.offsetHeight || 0
			if (top <= offsetTop && top + height > offsetTop) {
				setIsFixed(true)
			} else {
				setIsFixed(false)
			}
		}

		window.addEventListener('scroll', handleScroll)
		return () => {
			window.removeEventListener('scroll', handleScroll)
		}
	}, [])

	const [showSidebar, setShowSidebar] = useState<boolean>(true)
	const [width, setWidth] = useState(0)
	const [height, setHeight] = useState(props.height && props.height >= 300 ? props.height : 300)
	useEffect(() => {
		const offsetWidth = showSidebar ? 200 : 0
		const observer = new ResizeObserver((entries) => {
			for (let entry of entries) {
				if (entry.target === ref.current) {
					setWidth(ref.current.offsetWidth - offsetWidth)
				}
			}
		})
		if (ref.current) {
			observer.observe(ref.current)
		}
		return () => {
			observer.disconnect()
		}
	}, [showSidebar])

	// Toggle the sidebar
	const toggleSidebar = () => {
		setShowSidebar(!showSidebar)
	}

	const TabItemLabel = (props: { text: string; icon: string }) => {
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

	const onTabChange = (key: string) => {
		setActiveFlow(key)
	}

	const onDataChange = (data: any) => {
		console.log(data)
	}

	const onTabEdit = (targetKey: React.MouseEvent | React.KeyboardEvent | string, action: 'add' | 'remove') => {
		// Add a new tab
		if (action === 'add') {
			const newFlow = blankFlow()
			setFlows([...flows, newFlow])
			setActiveFlow(newFlow.key)
			return
		}

		// Remove the tab
		let newActiveKey = activeFlow
		let lastIndex = -1
		flows.forEach((flow, i) => {
			if (flow.key === targetKey) {
				lastIndex = i - 1
			}
		})
		const newFlows = flows.filter((flow) => flow.key !== targetKey)
		if (newFlows.length === 0) {
			// Notifies the parent component to remove the component
			message.error(is_cn ? '至少保留一个流程' : 'At least one flow must be retained')
			return
		}
		if (newFlows.length && newActiveKey === targetKey) {
			if (lastIndex >= 0) {
				newActiveKey = newFlows[lastIndex].key
			} else {
				newActiveKey = newFlows[0].key
			}
		}

		setFlows([...newFlows])
		setActiveFlow(newActiveKey)
	}

	const cardType = props.multiple === true ? 'editable-card' : 'card'
	const hideTabs = props.multiple === true ? '' : 'hideTabs'

	// Convert value to flow
	const valueToFlow = (value: FlowValue, index: number) => {
		const text = is_cn ? '<未命名>' : '<Untitled>'
		const flow = value.flow || { name: text, label: text }
		const key = `${flow.name || flow.label || text}-${index}`
		return {
			label: <TabItemLabel text={flow.label || flow.name || ''} icon={IconName(flow.icon)} />,
			value: value,
			key: key,
			children: (
				<Builder
					width={width}
					height={height}
					fixed={isFixed}
					offsetTop={offsetTop}
					showSidebar={showSidebar}
					setting={setting}
					value={{ ...value, key: key }}
					toggleSidebar={toggleSidebar}
					onDataChange={onDataChange}
				/>
			)
		}
	}

	const blankFlow = () => {
		const text = is_cn ? `<未命名-${flows.length + 1}>` : `<Untitled-${flows.length + 1}>`
		const flow: FlowValue = { flow: { name: text, label: text } }
		const key = `blank-${Date.now().toString()}`
		return {
			label: <TabItemLabel text={text} icon={IconName()} />,
			key: key,
			value: value,
			children: (
				<Builder
					width={width}
					height={height}
					fixed={isFixed}
					offsetTop={offsetTop}
					value={flow}
					showSidebar={showSidebar}
					setting={setting}
					toggleSidebar={toggleSidebar}
					onDataChange={onDataChange}
				/>
			)
		}
	}

	// Update flows by setting (initialization or setting change)
	const updateFlowsBySetting = (setting?: Setting) => {
		if (!setting) return
		const values: FlowValue[] = GetValues(value || setting.defaultValue)
		const flows = values.map(valueToFlow)
		flows.length === 0 && flows.push(blankFlow())
		setFlows([...flows])
	}

	// Refresh flows (when the width, height, or sidebar status changes)
	const refreshFlows = () => {
		const newFlows = flows.map((flow) => {
			return {
				...flow,
				children: (
					<Builder
						width={width}
						height={height}
						fixed={isFixed}
						value={{ ...flow.value }}
						offsetTop={offsetTop}
						showSidebar={showSidebar}
						setting={setting}
						toggleSidebar={toggleSidebar}
						onDataChange={onDataChange}
					/>
				)
			}
		})
		setFlows([...newFlows])
	}
	useEffect(() => updateFlowsBySetting(setting), [setting])
	useEffect(() => refreshFlows(), [width, showSidebar, height, isFixed])

	// Get setting
	useEffect(() => {
		setLoading(true)
		if (global.loading) return
		if (loading) return
		if (!props.setting) return

		GetSetting(props.setting)
			.then((setting) => {
				setLoading(false)
				setSetting(setting)
			})
			.catch(() => setLoading(false))
	}, [props.setting])

	return (
		<div className={clsx(styles._local)} ref={ref}>
			<If condition={loading}>
				<Then>
					<div className='loading' style={{ height: height }}>
						<Skeleton active round />
					</div>
				</Then>
				<Else>
					<Tabs
						items={flows}
						className={hideTabs}
						onChange={onTabChange}
						activeKey={activeFlow == '' && flows.length > 0 ? flows[0].key : activeFlow}
						type={cardType}
						onEdit={onTabEdit}
						style={{ width: '100%' }}
					/>
				</Else>
			</If>
		</div>
	)
})

const Index = (props: IProps) => {
	const { __bind, __name, itemProps, ...rest_props } = props
	return (
		<Item {...itemProps} {...{ __bind, __name }}>
			<FlowBuilder {...rest_props} {...{ __bind, __name }}></FlowBuilder>
		</Item>
	)
}

export default window.$app.memo(Index)
