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
}

interface IPropsCommonTag {
	pure: IProps['pure']
	margin?: boolean
	item: Component.Option | undefined
}

const CommonTag = window.$app.memo(({ pure, margin, item }: IPropsCommonTag) => {
	if (!item) return <span className='edit_text'>-</span>
	if (pure) return <span className='edit_text'>{item.label}</span>

	const style: React.CSSProperties = {}

	if (margin) style['marginRight'] = 4

	return (
		<Tag className={clsx([styles._local, 'edit_text'])} color={item.color} style={style}>
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

	if (!x.remote.options.length) return null

	if (typeof props.__value === 'string') {
		return <CommonTag pure={props.pure} item={x.item}></CommonTag>
	}

	if (Array.isArray(props.__value) && props.__value.length) {
		return (
			<div className='edit_text flex'>
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

	return <span className='edit_text'>-</span>
}

export default new window.$app.Handle(Index).by(observer).by(window.$app.memo).get()
