import { Drawer, Input } from 'antd'

import { Item } from '@/components'
import { getLocale } from '@umijs/max'

import type { InputProps } from 'antd'
import type { Component } from '@/types'

import GridLayout from 'react-grid-layout'

import { Icon } from '@/widgets'
import { useEffect, useRef, useState } from 'react'

import 'react-grid-layout/css/styles.css'
import styles from './index.less'
import clsx from 'clsx'

interface IProps extends InputProps, Component.PropsEditComponent {}

type Layout = GridLayout.Layout & {
	icon?: string
}

const Index = (props: IProps) => {
	const ref = useRef<HTMLDivElement>(null)
	const [width, setWidth] = useState(0)
	const [height, setHeight] = useState(0)
	const { __bind, __name, itemProps, ...rest_props } = props
	const [open, setOpen] = useState(false)
	const [item, setItem] = useState<Record<string, any>>({})

	const is_cn = getLocale() === 'zh-CN'

	const showDrawer = (key: string) => {
		const layoutItem = layout.find((item) => item.i === key)
		setItem({ ...layoutItem, title: `${key} Setting` })
		setOpen(true)
	}

	const onClose = () => {
		setOpen(false)
	}

	const [layout, setLayout] = useState<Layout[]>([
		{ i: '1', x: 0, y: 0, w: 4, h: 1, resizeHandles: ['w', 'e'] },
		{ i: '2', x: 4, y: 0, w: 4, h: 1, resizeHandles: ['w', 'e'] },
		{ i: '3', x: 8, y: 0, w: 4, h: 1, resizeHandles: ['w', 'e'] }
	])

	// unique id generator
	// use uuid
	function generateID(): string {
		const timestamp: number = new Date().getTime()
		const random: number = Math.floor(Math.random() * 10000)
		const uniqueId: string = `${timestamp}${random}`
		return uniqueId
	}

	// layout: Layout[], item: Layout, e: Event)
	const onDrop = (layout: Layout[], layoutItem: GridLayout.Layout, e: any) => {
		const raw = e.dataTransfer.getData('text') || ''
		let data: Record<string, any> = {}
		try {
			data = JSON.parse(raw)
		} catch (e: any) {
			console.error(`Error parsing JSON data: ${e.message}`)
		}

		// Add the new item to the layout
		const idx = generateID()
		layout[layout.length - 1].i = `${data.type} ${idx}`
		layout[layout.length - 1].resizeHandles = ['w', 'e']
		layout[layout.length - 1].icon = data.icon || 'material-format_align_left'
		setLayout(layout)
	}

	// Update the layout when the layout changes
	const onLayoutChange = (layout: Layout[]) => {
		setLayout(layout)
	}

	const onRemove = (key: string) => {
		setLayout((prev) => prev.filter((item) => item.i !== key))
	}

	const onClone = (key: string) => {
		const layoutItem = layout.find((item) => item.i === key)
		if (layoutItem) {
			const idx = generateID()
			const item = { ...layoutItem, i: `${idx}` }

			// Set the new item to the right of the old one
			const maxX = Math.max(...layout.map((item) => item.x))
			const maxY = Math.max(...layout.map((item) => item.y))
			const x = maxX + 4 >= 12 ? 0 : maxX + 4
			const y = maxX + 4 >= 12 ? maxY + 1 : maxY
			const newItem = { ...item, x, y }
			setLayout((prev) => [...prev, newItem])
		}
	}

	// onDropDragOver: (e: DragOverEvent) => Layout
	const onDropDragOver = (e: any) => {
		return { w: 4, h: 1 }
	}

	// Set the width of the grid layout
	useEffect(() => {
		const observer = new ResizeObserver((entries) => {
			for (let entry of entries) {
				if (entry.target === ref.current) {
					setWidth(ref.current.offsetWidth - 200)
					setHeight(300)
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

	return (
		<Item {...itemProps} {...{ __bind, __name }}>
			<div className={clsx(styles._local, 'site-drawer-render-in-current-wrapper')} ref={ref}>
				<div className='sidebar'>
					<div
						className='item'
						draggable={true}
						unselectable='on'
						onDragStart={(e) =>
							e.dataTransfer.setData(
								'text/plain',
								JSON.stringify({ type: 'Input', icon: 'material-format_align_left' })
							)
						}
					>
						<Icon size={14} name='material-format_align_left' className='mr_6' /> Input
					</div>
					<div
						className='item'
						draggable={true}
						unselectable='on'
						onDragStart={(e) =>
							e.dataTransfer.setData(
								'text/plain',
								JSON.stringify({ type: 'Select', icon: 'material-view_list' })
							)
						}
					>
						<Icon size={14} name='material-view_list' className='mr_6' /> Select
					</div>
					<div
						className='item'
						draggable={true}
						unselectable='on'
						onDragStart={(e) =>
							e.dataTransfer.setData(
								'text/plain',
								JSON.stringify({ type: 'Date', icon: 'material-date_range' })
							)
						}
					>
						<Icon size={14} name='material-date_range' className='mr_6' /> Date
					</div>
				</div>
				<div style={{ padding: 12 }}>
					<div className='relative'>
						<GridLayout
							className='layout'
							layout={layout}
							cols={12}
							rowHeight={42}
							width={width}
							onDrop={onDrop}
							onDropDragOver={onDropDragOver}
							onLayoutChange={onLayoutChange}
							isDroppable={true}
							draggableHandle='.drag-handle'
							style={{ minWidth: width, minHeight: height }}
						>
							{layout.map((item) => (
								<div className='field' key={item.i}>
									<div className='drag-handle'>
										<Icon
											size={14}
											name={item.icon || 'material-format_align_left'}
											className='mr_6'
										/>
										{item.i}
									</div>
									<div className='setting'>
										<Icon
											size={14}
											name='material-content_copy'
											onClick={() => onClone(item.i)}
										/>
										<Icon
											size={14}
											name='material-settings'
											onClick={() => showDrawer(item.i)}
										/>
										<Icon
											size={14}
											onClick={() => onRemove(item.i)}
											name='material-close'
										/>
									</div>
								</div>
							))}
						</GridLayout>
					</div>
				</div>
				<Drawer
					title={item.title}
					placement='right'
					closable={false}
					maskClosable={true}
					onClose={onClose}
					open={open}
					getContainer={false}
					className='drawer'
					maskClassName='mask'
					style={{ position: 'absolute' }}
				>
					<p>Some contents...</p>
				</Drawer>
			</div>
		</Item>
	)
}

export default window.$app.memo(Index)
