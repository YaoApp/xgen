import { Skeleton } from 'antd'

import { Item } from '@/components'

import type { Component } from '@/types'

import { useEffect, useRef, useState } from 'react'

import 'react-grid-layout/css/styles.css'
import styles from './index.less'
import clsx from 'clsx'
import { Data, Setting } from './types'
import Sidebar from './components/Sidebar'
import Canvas from './components/Canvas'
import { Else, If, Then } from 'react-if'
import { GetSetting } from './utils'
import { useGlobal } from '@/context/app'

interface IFormBuilderProps {
	setting?: Component.Request
	presets?: Component.Request
	height?: number
	panelWidth?: number

	value?: Data
	disabled?: boolean

	label?: string
	bind?: string
	type?: string
	onChange?: (v: any) => void
}

interface IProps extends Component.PropsEditComponent, IFormBuilderProps {}

const FormBuilder = window.$app.memo((props: IProps) => {
	const [width, setWidth] = useState(0)
	const [height, setHeight] = useState(props.height && props.height >= 300 ? props.height : 300)
	const [contentHeight, setContentHeight] = useState(props.height && props.height >= 300 ? props.height : 300)
	const [isFixed, setIsFixed] = useState(false)
	const [value, setValue] = useState<Data | undefined>()
	const [data, setData] = useState<Data>()
	const [loading, setLoading] = useState<boolean>(false)
	const [setting, setSetting] = useState<Setting | undefined>(undefined)
	const [showSidebar, setShowSidebar] = useState<boolean>(true)
	const [fullscreen, setFullscreen] = useState<boolean>(false)
	const [mask, setMask] = useState(true)

	const ref = useRef<HTMLDivElement>(null)
	const global = useGlobal()

	const toggleSidebar = () => {
		setShowSidebar(!showSidebar)
	}

	// Fixed sidebar, canvas and toolbar
	const offsetTop = 80
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

	const widthPadding = 0
	useEffect(() => {
		let offsetWidth = showSidebar ? 200 + widthPadding : widthPadding
		if (!mask) {
			offsetWidth = offsetWidth + 420
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
	}, [showSidebar, mask])

	useEffect(() => {
		const observer = new ResizeObserver((entries) => {
			for (let entry of entries) {
				if (entry.target === ref.current) {
					setWidth(ref.current.offsetWidth - 200 - widthPadding)
				}
			}
		})
		if (ref.current) {
			observer.observe(ref.current)
		}
		return () => {
			observer.disconnect()
		}
	}, [])

	useEffect(() => {
		if (fullscreen) {
			setHeight(window.innerHeight - 64)
			return
		}
		setHeight(props.height && props.height >= 300 ? props.height : 300)
	}, [fullscreen])

	useEffect(() => {
		if (!props.value) return
		setValue(props.value)
		setData(props.value)
	}, [props.value])

	// Update value
	useEffect(() => {
		if (!data) return
		props.onChange && props.onChange(data)
	}, [data])

	// Canvas setting
	const onCanvasChange = (value: Data, height: number) => {
		setContentHeight(height)
		setData(() => value)
	}

	// Get setting
	useEffect(() => {
		setLoading(true)
		if (global.loading) return
		if (!props.setting) return
		GetSetting(props.setting)
			.then((setting) => {
				setLoading(false)
				setSetting(setting)
			})
			.catch(() => {
				setLoading(false)
			})
	}, [props.setting])

	// for full screen
	const fullScreenStyle: React.CSSProperties = {
		bottom: 0,
		display: 'flex',
		height: '100vh',
		left: 0,
		margin: 0,
		padding: 0,
		position: 'fixed',
		right: 0,
		top: 0,
		width: '100%',
		overflowY: 'hidden',
		zIndex: 1000
	}

	return (
		<div className={clsx([styles._local])} ref={ref} style={fullscreen ? fullScreenStyle : {}}>
			<If condition={loading}>
				<Then>
					<div className='loading'>
						<Skeleton active round />
					</div>
				</Then>
				<Else>
					<Sidebar
						types={setting?.types}
						height={height}
						offsetTop={offsetTop}
						fixed={isFixed}
						visible={showSidebar}
						toggleSidebar={toggleSidebar}
						fullscreen={fullscreen}
					/>
					<Canvas
						offsetTop={offsetTop}
						fixed={isFixed}
						width={width}
						panelWidth={props.panelWidth || 420}
						height={height}
						contentHeight={contentHeight}
						setting={setting}
						presets={props.presets}
						onChange={onCanvasChange}
						value={value}
						fullscreen={fullscreen}
						setFullscreen={setFullscreen}
						showSidebar={showSidebar}
						toggleSidebar={toggleSidebar}
						mask={mask}
						setMask={setMask}
						__namespace={props.__namespace}
						__bind={props.__bind}
					/>
				</Else>
			</If>
		</div>
	)
})

const Index = (props: IProps) => {
	const { __bind, __namespace, __name, itemProps, ...rest_props } = props
	return (
		<Item {...itemProps} {...{ __bind, __name }}>
			<FormBuilder {...rest_props} {...{ __bind, __namespace, __name }}></FormBuilder>
		</Item>
	)
}

export default window.$app.memo(Index)
