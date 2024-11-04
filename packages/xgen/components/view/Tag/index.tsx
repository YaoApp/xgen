import { Tag } from 'antd'
import clsx from 'clsx'
import { observer } from 'mobx-react-lite'
import React, { useLayoutEffect, useMemo, useState } from 'react'
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

const presets: Record<string, string> = {
	primary: styles._primary,
	danger: styles._danger,
	success: styles._success,
	warning: styles._warning,
	info: styles._info,
	title: styles._title,
	placeholder: styles._placeholder
}

const CommonTag = window.$app.memo(({ pure, margin, item }: IPropsCommonTag) => {
	if (item?.label === '<empty>')
		return <Tag className={styles._local} color={item.color} style={{ backgroundColor: 'transparent' }}></Tag>
	if (!item || (!item.label && !item.value)) return <span>-</span>
	if (pure) return <span>{item.label}</span>

	const style: React.CSSProperties = {}
	if (margin) style['marginRight'] = 4
	if (item.textColor) style['color'] = item.textColor

	const className = [styles._local]
	if (item.color && presets[item.color]) className.push(presets[item.color])
	return (
		<Tag className={clsx(...className)} color={item.color} style={style}>
			{item.label}
		</Tag>
	)
})

const Index = (props: IProps) => {
	const [x] = useState(() => container.resolve(Model))

	useLayoutEffect(() => {
		x.remote.raw_props = props
		x.remote.init(props.__value)
	}, [])

	const options = useMemo(() => {
		if (props.options) return props.options
		return x.remote.options
	}, [x.remote.options])

	if (typeof props.__value === 'string' || typeof props.__value === 'number') {
		// Match the label of the current value
		if (options) {
			const option = options.find((item) => item.value === props.__value)
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
					const value = item.value || item
					const option = x.find(value) || { label: value, value: value }
					return <CommonTag pure={props.pure} item={option} margin key={index}></CommonTag>
				})}
			</div>
		)
	}

	return <span>-</span>
}

export default new window.$app.Handle(Index).by(observer).by(window.$app.memo).get()
