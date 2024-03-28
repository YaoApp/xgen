import { Input } from 'antd'

import { Item } from '@/components'
import { getLocale } from '@umijs/max'

import type { InputProps } from 'antd'
import type { Component } from '@/types'

import GridLayout from 'react-grid-layout'

import styles from './index.less'
import { Icon } from '@/widgets'
import { useEffect, useRef, useState } from 'react'

interface IProps extends InputProps, Component.PropsEditComponent {}

const Index = (props: IProps) => {
	const ref = useRef<HTMLDivElement>(null)
	const [width, setWidth] = useState(0)
	const { __bind, __name, itemProps, ...rest_props } = props
	const is_cn = getLocale() === 'zh-CN'
	const layout = [
		{ i: 'a', x: 0, y: 0, w: 4, h: 1, isResizable: true },
		{ i: 'b', x: 4, y: 0, w: 4, h: 1 },
		{ i: 'c', x: 8, y: 0, w: 4, h: 1 }
	]

	// 读取元素宽度
	useEffect(() => {
		if (ref.current) {
			setWidth(ref.current.offsetWidth - 212)
		}
	}, [ref.current])

	return (
		<Item {...itemProps} {...{ __bind, __name }}>
			<div className={styles._local} ref={ref}>
				<div className='sidebar'>
					<div className='item'>
						<Icon size={14} name='material-format_align_left' className='mr_6' /> Input
					</div>
					<div className='item'>
						<Icon size={14} name='material-view_list' className='mr_6' /> Select
					</div>
					<div className='item'>
						<Icon size={14} name='material-date_range' className='mr_6' /> Date
					</div>
				</div>
				<div className='relative'>
					<GridLayout
						className='layout'
						layout={layout}
						cols={12}
						rowHeight={42}
						width={width}
						resizeHandles={['s', 'w', 'e', 'n', 'sw', 'nw', 'se', 'ne']}
					>
						<div className='field' key='a'>
							<div>
								<Icon size={14} name='material-format_align_left' className='mr_6' />
								Mobile
							</div>
							<a href='#'>
								<Icon size={14} name='material-settings' className='ml_6' />
							</a>
						</div>
						<div className='field' key='b'>
							<div>
								<Icon size={14} name='material-view_list' className='mr_6' />
								<span> Category </span>
							</div>
							<a href='#'>
								<Icon size={14} name='material-settings' className='ml_6' />
							</a>
						</div>
						<div className='field' key='c'>
							<div>
								<Icon size={14} name='material-date_range' className='mr_6' />
								<span> Published At </span>
							</div>
							<a href='#'>
								<Icon size={14} name='material-settings' className='ml_6' />
							</a>
						</div>
					</GridLayout>
				</div>
			</div>
		</Item>
	)
}

export default window.$app.memo(Index)
