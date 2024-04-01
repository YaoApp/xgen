import { Drawer, Input, Skeleton } from 'antd'

import { Item } from '@/components'

import type { Component } from '@/types'

import { useEffect, useRef, useState } from 'react'

import 'react-grid-layout/css/styles.css'
import styles from './index.less'
import clsx from 'clsx'
import { Presets, Remote, Setting } from './types'
import Sidebar from './components/Sidebar'
import Canvas from './components/Canvas'
import { Else, If, Then } from 'react-if'
import { GetPresets, GetSetting } from './utils'

interface IFormBuilderIProps {
	setting?: Remote | Setting
	presets?: Remote | Presets
	height?: number
	hideLabel?: boolean
	data?: Record<string, any>

	__value: any // initial value
	value: any
	disabled?: boolean

	label?: string
	bind?: string
	namespace?: string
	type?: string
	onChange?: (v: any) => void
}

interface IProps extends IFormBuilderIProps, Component.PropsEditComponent {}

const Index = (props: IProps) => {
	const { __bind, __value, __name, itemProps, ...rest_props } = props
	const [loading, setLoading] = useState<boolean>(false)
	const [setting, setSetting] = useState<Setting | undefined>(undefined)
	const [presets, setPresets] = useState<Presets | undefined>(undefined)
	const ref = useRef<HTMLDivElement>(null)

	// Canvas setting
	const onChange = (v: any, height: number) => {
		height = height + 24
		setHeight(height >= 300 ? height : 300)
	}

	// Set the width of the grid layout
	const [width, setWidth] = useState(0)
	const [height, setHeight] = useState(props.height && props.height >= 300 ? props.height : 300)
	useEffect(() => {
		const observer = new ResizeObserver((entries) => {
			for (let entry of entries) {
				if (entry.target === ref.current) {
					setWidth(ref.current.offsetWidth - 200)
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

	// Get setting
	useEffect(() => {
		if (!props.setting) return

		setLoading(true)
		GetSetting(props.setting)
			.then((setting) => {
				setLoading(false)
				setSetting(setting)
			})
			.catch(() => {
				setLoading(false)
			})
	}, [props.setting])

	// Get presets
	useEffect(() => {
		if (!props.presets) return
		setLoading(true)
		GetPresets(props.presets)
			.then((presets) => {
				setLoading(false)
				setPresets(presets)
			})
			.catch(() => {
				setLoading(false)
			})
	}, [props.presets])

	return (
		<Item {...itemProps} {...{ __bind, __name }}>
			<div className={clsx(styles._local)} ref={ref}>
				<If condition={loading}>
					<Then>
						<div className='loading'>
							<Skeleton active round />
						</div>
					</Then>
					<Else>
						<Sidebar types={setting?.types} height={height} />
						<Canvas
							width={width}
							setting={setting}
							presets={presets}
							onChange={onChange}
							value={__value}
						/>
					</Else>
				</If>
			</div>
		</Item>
	)
}

export default window.$app.memo(Index)
