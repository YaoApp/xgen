import { Tag } from 'antd'
import clsx from 'clsx'
import { observer } from 'mobx-react-lite'
import React, { useLayoutEffect, useState } from 'react'
import { container } from 'tsyringe'

import styles from './index.less'
import Model from './model'

import type { Component } from '@/types'
import type { TagProps } from 'antd'

export interface IProps extends TagProps, Component.PropsViewComponent {
	bind?: string
	options?: Component.Options
	remote?: Component.Request
	pure?: boolean
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

	if (margin) style['margin'] = 3

	return (
		<Tag className={clsx([styles._local, 'edit_text'])} color={item.color} style={style}>
			{item.label}
		</Tag>
	)
})

const Index = (props: IProps) => {
	const [x] = useState(() => container.resolve(Model))

	useLayoutEffect(() => {
		x.props = props

		x.init()
	}, [])

	if (!x.options.length) return null

	if (typeof x.value === 'string') {
		return <CommonTag pure={props.pure} item={x.item}></CommonTag>
	}

	if (Array.isArray(x.value) && x.value.length) {
		return (
			<div className='edit_text flex'>
				{x.value.map((item, index) => {
					return (
						<CommonTag
							pure={props.pure}
							item={x.find(item.value || item)}
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
