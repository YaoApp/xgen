import { Skeleton, Tabs, message } from 'antd'
import type { Component } from '@/types'
import { Item } from '@/components'
import { useEffect, useRef, useState } from 'react'

import styles from './index.less'
import clsx from 'clsx'
import { Else, If, Then } from 'react-if'
import { FlowTab, FlowValue, Setting } from './types'
import { GetSetting, GetValues, IconName } from './utils'
import { useGlobal } from '@/context/app'
import { getLocale } from '@umijs/max'
import Tab from './components/Tab'

interface IFlowBuilderProps {
	setting?: any

	height?: number
	multiple?: boolean

	value: any
	disabled?: boolean

	label?: string
	bind?: string
	namespace?: string
	type?: string
	removeAttribution?: boolean
	execute?: Component.Request
	presets?: Component.Request
	onChange?: (v: any) => void
}

interface IProps extends Component.PropsEditComponent, IFlowBuilderProps {}

const FlowBuilder = window.$app.memo((props: IProps) => {
	const global = useGlobal()
	const is_cn = getLocale() === 'zh-CN'
	const ref = useRef<HTMLDivElement>(null)

	const { __namespace, __bind } = props
	const [initialized, setInitialized] = useState<boolean>(false)

	const [loading, setLoading] = useState<boolean>(false)
	const [showMask, setShowMask] = useState(true)
	const [setting, setSetting] = useState<Setting | undefined>(undefined)
	const [flowTabs, setFlowTabs] = useState<any[]>([])
	const [activeFlow, setActiveFlow] = useState<string>('')
	const [data, setData] = useState<FlowValue[]>(GetValues(props.value))

	// When the data is updated in the flow
	// Update the value of the form
	// Type is: nodes, edges, flow, execute
	const onData = (id: string, type: string, value: any) => {
		// console.log('onData', id, type, value)

		// Update Data
		setData((data) => {
			// Find the index of the data
			const index = data.findIndex((value: FlowValue) => value.id === id)
			if (index === -1) return data

			switch (type) {
				case 'nodes':
					data[index].nodes = value
					break

				case 'edges':
					data[index].edges = value
					break

				case 'flow':
					data[index].flow = value

					// Update Tab
					if (props.multiple === true) {
						setFlowTabs((flowTabs: any) => {
							const values: FlowValue[] = []
							flowTabs.forEach((flow: any) => {
								let updateValue = flow?.value || {}
								if (updateValue.id === id) {
									updateValue.flow = value
								}
								updateValue && values.push(updateValue)
							})

							const newFlowTabs = values.map((flowValue: FlowValue, index: number) =>
								Tab({
									...props,
									flowValue,
									is_cn,
									index,
									width,
									height,
									isFixed,
									fullscreen,
									setFullscreen,
									offsetTop,
									showSidebar,
									setting,
									onData,
									toggleSidebar,
									removeAttribution: props.removeAttribution,
									showMask,
									setShowMask
								})
							)

							return newFlowTabs
						})
					}

					break

				case 'execute':
					data[index].execute = value
					break
			}

			return [...data]
		})
	}

	// Trigger the onChange event
	useEffect(() => props.onChange && props.onChange(data), [data])

	// Set the width of the grid layout
	const offsetTop = 80
	const [isFixed, setIsFixed] = useState(false)
	const [fullscreen, _setFullscreen] = useState(false)
	const setFullscreen = (value: boolean) => {
		_setFullscreen(() => value)
	}

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
		let offsetWidth = showSidebar ? 200 : 0
		if (!showMask) {
			offsetWidth = offsetWidth + 460
		}
		const observer = new ResizeObserver((entries) => {
			for (let entry of entries) {
				if (entry.target === ref.current) {
					const w = ref.current.offsetWidth - offsetWidth
					setWidth(w > 0 ? w : 200)
				}
			}
		})
		if (ref.current) {
			observer.observe(ref.current)
		}
		return () => {
			observer.disconnect()
		}
	}, [showSidebar, showMask])

	useEffect(() => {
		if (fullscreen) {
			setHeight(window.innerHeight - (props.multiple ? 80 : 38))
			return
		}
		setHeight(props.height && props.height >= 300 ? props.height : 300)
	}, [fullscreen])

	// Toggle the sidebar
	const toggleSidebar = () => {
		setShowSidebar(!showSidebar)
	}

	const onTabChange = (key: string) => {
		setActiveFlow(key)
	}

	const onTabEdit = (targetKey: React.MouseEvent | React.KeyboardEvent | string, action: 'add' | 'remove') => {
		// Add a new tab
		if (action === 'add') {
			setFlowTabs((flowTabs) => {
				const newFlowTabs = [...flowTabs, blankFlowTab(flowTabs.length)]
				setActiveFlow(() => newFlowTabs[newFlowTabs.length - 1].id)

				// Update data
				setData(() => {
					const data: FlowValue[] = []
					newFlowTabs.forEach((flow) => {
						flow?.value && data.push(flow.value)
					})
					return data
				})

				return newFlowTabs
			})
			return
		}

		// Remove the tab
		setFlowTabs((flowTabs: any) => {
			let newActiveKey = activeFlow
			let lastIndex = -1
			flowTabs.forEach((flow: any, i: number) => {
				if (flow.id === targetKey) {
					lastIndex = i - 1
				}
			})
			const newFlows = flowTabs.filter((flow: any) => flow.id !== targetKey)
			if (newFlows.length === 0) {
				// Notifies the parent component to remove the component
				message.error(is_cn ? '至少保留一个流程' : 'At least one flow must be retained')
				return flowTabs
			}

			if (newFlows.length && newActiveKey === targetKey) {
				if (lastIndex >= 0) {
					newActiveKey = newFlows[lastIndex].key
				} else {
					newActiveKey = newFlows[0].key
				}
			}

			// Update data
			setData(() => {
				const data: FlowValue[] = []
				newFlows.forEach((flow: any) => {
					flow?.value && data.push(flow.value)
				})
				return data
			})

			setActiveFlow(() => newActiveKey)
			return newFlows
		})
	}

	const cardType = props.multiple === true ? 'editable-card' : 'card'
	const hideTabs = props.multiple === true ? '' : 'hideTabs'

	const blankFlowTab = (index: number) => {
		const text = is_cn ? `<未命名-${flowTabs.length + 1}>` : `<Untitled-${flowTabs.length + 1}>`
		const key = `${__namespace}-${__bind}-blank_${Date.now().toString()}`
		const flowValue: FlowValue = { flow: { name: text, label: text }, id: key }
		return Tab({
			...props,
			flowValue,
			is_cn,
			index,
			width,
			height,
			isFixed,
			fullscreen,
			setFullscreen,
			offsetTop,
			showSidebar,
			setting,
			onData,
			toggleSidebar,
			removeAttribution: props.removeAttribution,
			showMask,
			setShowMask
		})
	}

	// Update flowTabs by setting (initialization or setting change)
	const updateFlowsBySetting = (setting?: Setting) => {
		if (!setting) return
		if (initialized) return

		setInitialized(true)
		const values: FlowValue[] =
			GetValues(props.value).length == 0 ? GetValues(setting.defaultValue) : GetValues(props.value)
		const flowTabs = values.map((flowValue: FlowValue, index: number) =>
			Tab({
				...props,
				flowValue,
				is_cn,
				index,
				width,
				height,
				isFixed,
				fullscreen,
				setFullscreen,
				offsetTop,
				showSidebar,
				setting,
				onData,
				toggleSidebar,
				removeAttribution: props.removeAttribution,
				showMask,
				setShowMask
			})
		)
		if (flowTabs.length === 0) {
			const tab = blankFlowTab(0)
			flowTabs.push(tab)
		}

		setFlowTabs(() => [...flowTabs])
		setData(() => {
			const data: FlowValue[] = []
			flowTabs.forEach((flow) => {
				flow?.value && data.push(flow.value)
			})
			return data
		})
	}

	// Refresh flowTabs (when the width, height, or sidebar status changes)
	const refreshFlows = () => {
		setFlowTabs((flowTabs) => {
			const newFlows: FlowTab[] = []
			flowTabs.forEach((flow, index) => {
				const tab = Tab({
					...props,
					flowValue: flow.value,
					is_cn,
					index,
					width,
					height,
					isFixed,
					fullscreen,
					setFullscreen,
					offsetTop,
					showSidebar,
					setting,
					onData,
					toggleSidebar,
					removeAttribution: props.removeAttribution,
					showMask,
					setShowMask
				})
				if (tab) newFlows.push(tab)
			})
			return [...newFlows]
		})
	}
	useEffect(() => updateFlowsBySetting(setting), [setting])
	useEffect(() => refreshFlows(), [width, showSidebar, height, isFixed])

	// Get setting
	useEffect(() => {
		if (props.setting === undefined) return
		if (global.loading) return
		if (loading) return
		if (!props.setting) return

		setLoading(true)
		GetSetting(props.setting)
			.then((setting) => {
				setLoading(false)
				setSetting(setting)
			})
			.catch(() => setLoading(false))
	}, [props.setting])

	// for full screen
	const fullScreenStyle: React.CSSProperties = {
		bottom: 0,
		display: 'flex',
		height: '100%',
		left: 0,
		margin: 0,
		padding: 0,
		position: 'fixed',
		right: 0,
		top: 0,
		width: '100%',
		overflowY: 'auto',
		zIndex: 1000
	}

	return (
		<div
			className={clsx(fullscreen ? [styles._local, styles._fullscreen] : [styles._local])}
			ref={ref}
			style={fullscreen ? fullScreenStyle : {}}
		>
			<If condition={loading}>
				<Then>
					<div className='loading' style={{ height: height }}>
						<Skeleton active round />
					</div>
				</Then>
				<Else>
					<Tabs
						items={flowTabs}
						className={hideTabs}
						onChange={onTabChange}
						activeKey={activeFlow == '' && flowTabs?.length > 0 ? flowTabs[0].key : activeFlow}
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
	const { __namespace, __bind, __name, itemProps, ...rest_props } = props
	return (
		<Item {...itemProps} {...{ __bind, __name }}>
			<FlowBuilder {...rest_props} {...{ __namespace, __bind, __name }}></FlowBuilder>
		</Item>
	)
}

export default window.$app.memo(Index)
