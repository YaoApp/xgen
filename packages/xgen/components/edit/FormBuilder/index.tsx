import { Skeleton } from 'antd'

import { Item } from '@/components'

import type { Component } from '@/types'

import { useEffect, useRef, useState } from 'react'

import 'react-grid-layout/css/styles.css'
import styles from './index.less'
import clsx from 'clsx'
import { Data, Presets, Remote, Setting } from './types'
import Sidebar from './components/Sidebar'
import Canvas from './components/Canvas'
import { Else, If, Then } from 'react-if'
import { GetSetting } from './utils'
import { useGlobal } from '@/context/app'
import Ruler from './components/Ruler'

interface IFormBuilderProps {
	setting?: Remote | Setting
	presets?: Remote | Presets
	height?: number

	value: any
	disabled?: boolean

	label?: string
	bind?: string
	namespace?: string
	type?: string
	onChange?: (v: any) => void
}

interface IProps extends Component.PropsEditComponent, IFormBuilderProps {}

const FormBuilder = window.$app.memo((props: IProps) => {
	const [width, setWidth] = useState(0)
	const [height, setHeight] = useState(props.height && props.height >= 300 ? props.height : 300)
	const [isFixed, setIsFixed] = useState(false)
	const [value, setValue] = useState<any>()
	const [data, setData] = useState<Data>()
	const [loading, setLoading] = useState<boolean>(false)
	const [setting, setSetting] = useState<Setting | undefined>(undefined)
	const [showSidebar, setShowSidebar] = useState<boolean>(true)
	const [fullscreen, setFullscreen] = useState<boolean>(false)

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
			// console.log(top, height, top + height)
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

	const widthPadding = 24
	useEffect(() => {
		const offsetWidth = showSidebar ? 200 + widthPadding : widthPadding
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
			setHeight(window.innerHeight - 38)
			return
		}
		setHeight(props.height && props.height >= 300 ? props.height : 300)
	}, [fullscreen])

	useEffect(() => {
		if (!props.value) return
		if (!props.value.columns) return
		setValue(props.value?.columns || [])
		setData(props.value)
	}, [props.value])

	useEffect(() => {
		if (!data) return
		props.onChange && props.onChange(data)
	}, [data])

	// Canvas setting
	const onCanvasChange = (value: any, height: number) => {
		height = height + 24
		const h = height > (props.height || 300) ? height : props.height || 300
		setHeight(h)
		setData((data: any) => {
			const newData = { ...data }
			newData.columns = value
			return newData
		})
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
						showSidebar={showSidebar}
						fullscreen={fullscreen}
					/>
					<Canvas
						offsetTop={offsetTop}
						fixed={isFixed}
						width={width}
						height={height}
						setting={setting}
						presets={props.presets}
						onChange={onCanvasChange}
						value={value}
						fullscreen={fullscreen}
						setFullscreen={setFullscreen}
						showSidebar={showSidebar}
						toggleSidebar={toggleSidebar}
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
			<FormBuilder {...rest_props} {...{ __bind, __name }}></FormBuilder>
		</Item>
	)
}

export default window.$app.memo(Index)
