import { Skeleton, Tabs } from 'antd'
import type { Component } from '@/types'
import { Item } from '@/components'
import { useEffect, useRef, useState } from 'react'

import styles from './index.less'
import clsx from 'clsx'
import { Else, If, Then } from 'react-if'
import Sidebar from './components/Sidebar'
import Canvas from './components/Canvas'
import { Icon } from '@/widgets'
import { Type } from './types'

interface IFlowBuilderProps {
	setting?: any
	presets?: any
	height?: number

	value: any
	disabled?: boolean

	label?: string
	bind?: string
	namespace?: string
	type?: string
	mode?: string
	ai?: { placeholder: string }
	onChange?: (v: any) => void
}

interface IProps extends Component.PropsEditComponent, IFlowBuilderProps {}

const FlowBuilder = window.$app.memo((props: IProps) => {
	const ref = useRef<HTMLDivElement>(null)
	const [loading, setLoading] = useState<boolean>(false)

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

	const Builder = (props: { text: string; icon?: string }) => {
		return (
			<div className='builder'>
				<Sidebar types={types} height={height} />
				<Canvas icon={props.icon} text={props.text} width={width} />
			</div>
		)
	}

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
				<div style={{ marginLeft: 2 }}>{props.text}</div>
			</div>
		)
	}

	const cardType = props.mode === 'multiple' ? 'editable-card' : 'card'
	const hideTabs = props.mode === 'multiple' ? '' : 'hideTabs'

	const types: Type[] = [
		{
			name: 'analysis',
			label: 'AI 提取数据',
			icon: 'material-psychology'
		},
		{
			name: 'save',
			label: '保存表单数据',
			icon: 'material-cloud_download'
		},
		{
			name: 'goto',
			label: '页面跳转到',
			icon: 'material-link'
		},
		{
			name: 'http',
			label: '发送 HTTP 请求',
			icon: 'material-http'
		},
		{
			name: 'sms',
			label: '发送短信给',
			icon: 'material-outgoing_mail'
		}
	]

	const items = [
		{
			label: <Label text='保存' icon='material-save' />,
			key: 'item-1',
			children: <Builder icon='material-save' text='保存' />
		},
		{
			label: <Label text='提交' icon='material-prompt_suggestion' />,
			key: 'item-2',
			children: <Builder text='提交' icon='material-prompt_suggestion' />
		}
	]

	return (
		<div className={clsx(styles._local)} ref={ref}>
			<If condition={loading}>
				<Then>
					<div className='loading'>
						<Skeleton active round />
					</div>
				</Then>
				<Else>
					<Tabs items={items} className={hideTabs} type={cardType} style={{ width: '100%' }} />
				</Else>
			</If>
		</div>
	)
})

const Index = (props: IProps) => {
	const { __bind, __name, itemProps, ai, ...rest_props } = props
	console.log('FlowBuilder', ai)

	return (
		<Item {...itemProps} {...{ __bind, __name }}>
			<FlowBuilder {...rest_props} {...{ __bind, __name }}></FlowBuilder>
		</Item>
	)
}

export default window.$app.memo(Index)
