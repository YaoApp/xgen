import { Tag } from 'antd'
import clsx from 'clsx'
import { observer } from 'mobx-react-lite'
import React, { useLayoutEffect, useState } from 'react'
import { container } from 'tsyringe'

import styles from './index.less'
import Model from './model'

import type { Component } from '@/types'
import type { TagProps } from 'antd'
import type { Remote } from '@/types'

export interface IProps extends Remote.IProps, TagProps, Component.PropsViewComponent {
	bind?: string
	options?: Component.Options
	pure?: boolean
	useValue?: boolean
	color?: string
	textColor?: string
}

interface IPropsCommonTag {
	pure: IProps['pure']
	margin?: boolean
	item: Component.TagOption | undefined
}

const CommonTag = window.$app.memo(({ pure, margin, item }: IPropsCommonTag) => {
	if (!item) return <span>-</span>
	if (pure) return <span>{item.label}</span>

	const style: React.CSSProperties = {}

	if (margin) style['marginRight'] = 4
	if (item.textColor) style['color'] = item.textColor

	return (
		<Tag className={styles._local} color={item.color} style={style}>
			{item.label}
		</Tag>
	)
})

const Index = (props: IProps) => {
	const [x] = useState(() => container.resolve(Model))

	useLayoutEffect(() => {
		x.remote.raw_props = props

		x.remote.init()
	}, [])

	if (typeof props.__value === 'string') {
		// Match the label of the current value
		if (props.options) {
			const option = props.options.find((item) => item.value === props.__value)
			if (option) {
				return <CommonTag pure={props.pure} item={option}></CommonTag>
			}
		}

		// Use the value of props directly
		return (
			<CommonTag
				pure={props.pure}
				item={x.item || { label: props.__value, color: props.color, textColor: props.textColor }}
			></CommonTag>
		)
	}

	if (Array.isArray(props.__value) && props.__value.length) {
		return (
			<div className='flex'>
				{props.__value.map((item, index) => {
					return (
						<CommonTag
							pure={props.pure}
							item={x.find(item.value || item)}
							margin
							key={index}
						></CommonTag>
					)
				})}
			</div>
		)
	}

	return <span>-</span>
}

export default new window.$app.Handle(Index).by(observer).by(window.$app.memo).get()
