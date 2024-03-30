import { Icon } from '@/widgets'
import GridLayout from 'react-grid-layout'
import { Layout, Presets, Setting } from '../../types'
import { useRef, useState } from 'react'

interface IProps {
	width?: number
	setting?: Setting
	presets?: Presets
	showPanel: (key: string) => void
	onChange?: (v: any, height: number) => void
}

const Index = (props: IProps) => {
	const { width } = props
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
		// layout[layout.length - 1].icon = data.icon || 'material-format_align_left'
		setLayout(layout)
	}

	// Update the layout when the layout changes
	const onLayoutChange = (layout: Layout[]) => {
		setLayout(layout)

		const maxY = Math.max(...layout.map((item) => item.y))
		const height = (maxY + 1) * (42 + 10)
		props.onChange && props.onChange(layout, height)
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

	return (
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
					style={{ minWidth: width, minHeight: 300 }}
				>
					{layout.map((item) => (
						<div className='field' key={item.i}>
							<div className='drag-handle'>
								<Icon size={14} name={'material-format_align_left'} className='mr_6' />
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
									onClick={() => props.showPanel && props.showPanel(item.i)}
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
	)
}

export default window.$app.memo(Index)
