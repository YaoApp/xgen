import { Icon } from '@/widgets'
import GridLayout from 'react-grid-layout'
import { Field, Layout, Presets, Setting, Type } from '../../types'
import { useEffect, useState } from 'react'
import { TypeMappping, UpdatePosition, ValueToLayout } from '../../utils'

interface IProps {
	width?: number
	setting?: Setting
	presets?: Presets
	value: any // initial value
	showPanel: (key: string) => void
	onChange?: (v: any, height: number) => void
}

const Index = (props: IProps) => {
	const { width } = props
	const [layout, setLayout] = useState<Layout[]>([])
	const [fieldMap, setFieldMap] = useState<Record<string, Field>>({})
	const [typeMap, setTypeMap] = useState<Record<string, Type>>({})
	const [value, setValue] = useState<Field[]>([props.value])

	// update value
	useEffect(() => {
		if (props.value || props.setting?.defaultValue) {
			const res = ValueToLayout(props.value, props.setting?.defaultValue)
			setLayout(res.layout)
			setFieldMap(res.mapping)
			setValue(props.value || props.setting?.defaultValue)
		}
		if (props.setting) {
			const mappping = TypeMappping(props.setting)
			setTypeMap(mappping)
		}
	}, [props.setting, props.value])

	const onDrag = (layout: Layout[], layoutItem: GridLayout.Layout, e: any) => {
		const mapping = UpdatePosition(fieldMap, layout)
		setFieldMap(mapping)
	}

	const onResize = (layout: Layout[], layoutItem: GridLayout.Layout, e: any) => {
		const mapping = UpdatePosition(fieldMap, layout)
		setFieldMap(mapping)
	}

	// Clone the item
	const onClone = (key: string) => {
		const layoutItem = layout.find((item) => item.i === key)
		if (layoutItem && fieldMap[key]) {
			const copyField = { ...fieldMap[key] }
			copyField.x = layoutItem.x + layoutItem.w
			copyField.y = layoutItem.y

			const newValue = [...value, copyField]
			const res = ValueToLayout(newValue)
			setLayout(res.layout)
			setFieldMap(res.mapping)
			setValue(newValue)
		}
	}

	// Drop the item add the item to the layout
	const onDrop = (layout: Layout[], layoutItem: GridLayout.Layout, e: any) => {
		const raw = e.dataTransfer.getData('text') || ''
		let data: Record<string, any> = {}
		try {
			data = JSON.parse(raw)
		} catch (e: any) {
			console.error(`Error parsing JSON data: ${e.message}`)
		}

		const field = {
			type: data.type,
			x: layoutItem.x,
			y: layoutItem.y,
			width: data.width || 4,
			props: data.props || {}
		}

		const newValue = [...value, field]
		const res = ValueToLayout(newValue)
		setLayout(res.layout)
		setFieldMap(res.mapping)
		setValue(newValue)
	}

	// Update the layout when the layout changes
	const onLayoutChange = (layout: Layout[]) => {
		console.log('layout', layout)
		// Update the value
		const mapping = UpdatePosition(fieldMap, layout)
		setFieldMap(mapping)

		const maxY = Math.max(...layout.map((item) => item.y))
		const height = (maxY + 1) * (42 + 10)
		props.onChange && props.onChange(layout, height)
	}

	// Remove the item
	const onRemove = (key: string) => {
		// Update Layout
		const newLayout: Layout[] = layout.filter((item) => item.i !== key)
		const mapping = UpdatePosition(fieldMap, newLayout)
		setFieldMap(mapping)
		delete mapping[key]

		// Update Value
		const newValue = Object.values(mapping)
		setValue(newValue)
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
					onDrag={onDrag}
					onResize={onResize}
					draggableHandle='.drag-handle'
					style={{ minWidth: width, minHeight: 300 }}
				>
					{layout.map((item) => {
						const { i: key } = item
						const field = fieldMap[key]
						if (!field) {
							return null
						}

						if (!field.type) {
							return null
						}

						const type = typeMap[field.type]
						if (!type) {
							console.error(`[FormBuilder] Type not found: ${field.type}`)
							return null
						}

						const label = field.props?.label || type.label || type.name
						return (
							<div className='field' key={key}>
								<div className='drag-handle'>
									<Icon
										size={14}
										name={type.icon ? type.icon : 'material-format_align_left'}
										className='mr_6'
									/>
									{label}
								</div>
								<div className='setting'>
									<Icon
										size={14}
										name='material-content_copy'
										onClick={() => onClone(key)}
									/>
									<Icon
										size={14}
										name='material-settings'
										onClick={() => props.showPanel && props.showPanel(key)}
									/>
									<Icon
										size={14}
										onClick={() => onRemove(key)}
										name='material-close'
									/>
								</div>
							</div>
						)
					})}
				</GridLayout>
			</div>
		</div>
	)
}

export default window.$app.memo(Index)
