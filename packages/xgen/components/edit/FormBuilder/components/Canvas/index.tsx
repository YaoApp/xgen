import { Panel, Icon } from '@/widgets'
import GridLayout from 'react-grid-layout'
import { Field, Layout, Presets, Setting, Type, Remote } from '../../types'
import { useEffect, useState } from 'react'
import { GenerateID, LayoutToValue, TypeMappping, UpdatePosition, ValueToLayout } from '../../utils'
import clsx from 'clsx'
import Preset from '../Preset'
import { IconName, IconSize } from '@/components/edit/FlowBuilder/utils'
import { getLocale } from '@umijs/max'
import { Tooltip } from 'antd'
import { Background } from 'reactflow'
import Ruler from '../Ruler'

interface IProps {
	width?: number
	height?: number
	setting?: Setting
	presets?: Presets | Remote
	value: any // initial value
	fixed: boolean
	offsetTop: number
	onChange?: (v: any, height: number) => void

	toggleSidebar: () => void
	showSidebar: boolean
	fullscreen: boolean
	setFullscreen: (v: boolean) => void
}

const Index = (props: IProps) => {
	const { width } = props
	const [layout, setLayout] = useState<Layout[]>([])
	const [fieldMap, setFieldMap] = useState<Record<string, Field>>({})
	const [typeMap, setTypeMap] = useState<Record<string, Type>>({})
	const [value, setValue] = useState<Field[]>([props.value])

	// Panel setting
	const [open, setOpen] = useState(false)
	const [type, setType] = useState<Type | undefined>(undefined)
	const [active, setActive] = useState<string | undefined>(undefined)
	const [field, setField] = useState<Field | undefined>(undefined)
	const hidePanel = () => {
		setOpen(false)
		setActive(undefined)
	}
	const onPanelChange = (id: string, bind: string, value: any) => {
		if (field) {
			const props = { ...field.props }
			props[bind] = value
			setField({ ...field, props })

			// Update Mapping
			const mapping = { ...fieldMap }
			mapping[id] = { ...field, props }
			setFieldMap(mapping)

			updateValue(LayoutToValue(layout, mapping))
		}
	}
	const showPanel = (id: string, field: Field, type: Type) => {
		setField(field)
		setType(type)
		setActive(id)
		setOpen(true)
	}

	// Update the value
	const updateValue = (value: Field[]) => {
		const maxY = Math.max(...layout.map((item) => item.y))
		const height = (maxY + 1) * (42 + 10)
		props.onChange && props.onChange(value, height)
	}

	// Update value when set from outside
	useEffect(() => {
		if (props.setting) {
			const mappping = TypeMappping(props.setting)
			setTypeMap(mappping)
		}
	}, [props.setting])

	useEffect(() => {
		if (props.value || props.setting?.defaultValue) {
			const res = ValueToLayout(props.value, props.setting?.defaultValue?.columns || [])
			setLayout(res.layout)
			setFieldMap(res.mapping)
			setValue(props.value || props.setting?.defaultValue)
		}
	}, [props.value])

	// Update the layout when the layout changes
	const onLayoutChange = (layout: Layout[]) => {
		// Update the layout
		const mapping = UpdatePosition(fieldMap, layout)
		setFieldMap(mapping)
		setLayout(layout)
		const value = LayoutToValue(layout, mapping)
		updateValue(value)
	}

	const onDrag = (layout: Layout[], layoutItem: GridLayout.Layout, e: any) => {
		const mapping = UpdatePosition(fieldMap, layout)
		setFieldMap(mapping)
	}

	const onResize = (layout: Layout[], layoutItem: GridLayout.Layout, e: any) => {
		const mapping = UpdatePosition(fieldMap, layout)
		setFieldMap(mapping)
	}

	// add from the preset
	const onAdd = (field: Field) => {
		const maxY = Math.max(...layout.map((item) => item.y))
		const copyField = { ...field }
		copyField.id = GenerateID()
		copyField.x = 0
		copyField.y = maxY + 1

		const newValue = [...value, copyField]
		setValue(newValue)
		setLayout([
			...layout,
			{
				i: copyField.id,
				x: copyField.x,
				y: copyField.y,
				w: copyField.width || 4,
				h: 1,
				resizeHandles: ['w', 'e']
			}
		])
		setFieldMap({ ...fieldMap, [copyField.id]: copyField })
		showPanel(copyField.id, copyField, typeMap[copyField.type])
	}

	// Clone the item
	const onClone = (key: string) => {
		const layoutItem = layout.find((item) => item.i === key)
		if (layoutItem && fieldMap[key]) {
			const maxY = Math.max(...layout.map((item) => item.y))

			const copyField = { ...fieldMap[key] }
			copyField.id = GenerateID()
			copyField.x = 0
			copyField.y = maxY + 1

			const newValue = [...value, copyField]
			setValue(newValue)
			setLayout([
				...layout,
				{
					i: copyField.id,
					x: copyField.x,
					y: copyField.y,
					w: copyField.width || 4,
					h: 1,
					resizeHandles: ['w', 'e']
				}
			])
			setFieldMap({ ...fieldMap, [copyField.id]: copyField })
			showPanel(copyField.id, copyField, typeMap[copyField.type])
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
			id: GenerateID(),
			type: data.type,
			x: layoutItem.x,
			y: layoutItem.y,
			width: data.width || 4,
			props: data.props || {}
		}

		const newValue = [...value, field]
		setValue(newValue)
		setLayout([
			...layout,
			{ i: field.id, x: field.x, y: field.y, w: field.width, h: 1, resizeHandles: ['w', 'e'] }
		])
		setFieldMap({ ...fieldMap, [field.id]: field })
		showPanel(field.id, field, typeMap[field.type])
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

	const is_cn = getLocale() === 'zh-CN'
	const defaultLabel = is_cn ? '未命名' : 'Untitled'
	const [mask, setMask] = useState(true)

	const showPresets = () => {}
	const showSettings = () => {}

	return (
		<>
			<Panel
				open={open}
				onClose={hidePanel}
				onChange={onPanelChange}
				id={active}
				label={field?.props?.label || field?.props?.name || type?.label || 'Untitled'}
				data={field?.props}
				type={type}
				fixed={props.fixed}
				mask={mask}
				width={420}
				offsetTop={props.offsetTop}
			/>
			<div style={{ padding: 12 }}>
				<div className='head'>
					<div className='title'>
						<a
							onClick={props.toggleSidebar}
							style={{ marginRight: 6 }}
							className='flex align_center'
						>
							<Icon
								name={props.showSidebar ? 'material-first_page' : 'material-last_page'}
								size={18}
							/>
						</a>
						<Icon
							name={IconName(props.value?.flow?.icon)}
							size={IconSize(props.value?.flow?.icon)}
							style={{ marginRight: 4 }}
						/>
						{props.value?.form?.label || props.value?.form?.name || defaultLabel}
					</div>
					<div className='actions'>
						<Tooltip
							title={is_cn ? '插入' : 'Insert'}
							placement={props.fullscreen ? 'bottom' : 'top'}
						>
							<a style={{ marginRight: 24, marginTop: 2 }} onClick={showPresets}>
								<Icon name='icon-plus-circle' size={16} />
							</a>
						</Tooltip>

						<Tooltip
							title={is_cn ? '设置' : 'Settings'}
							placement={props.fullscreen ? 'bottom' : 'top'}
						>
							<a style={{ marginRight: 12, marginTop: 2 }} onClick={showSettings}>
								<Icon name='icon-sliders' size={16} />
							</a>
						</Tooltip>

						{!props.fullscreen ? (
							<Tooltip
								title={is_cn ? '全屏' : 'Full Screen'}
								placement={props.fullscreen ? 'bottom' : 'top'}
							>
								<a
									style={{ marginRight: 12, marginTop: 2 }}
									onClick={() => props.setFullscreen(true)}
								>
									<Icon name='icon-maximize' size={16} />
								</a>
							</Tooltip>
						) : (
							<Tooltip title={is_cn ? '退出全屏' : 'Exit Full Screen'} placement='bottom'>
								<a
									style={{ marginRight: 16, marginTop: 2 }}
									onClick={() => props.setFullscreen(false)}
								>
									<Icon name='icon-minimize' size={16} />
								</a>
							</Tooltip>
						)}
					</div>
				</div>
				<div className='relative'>
					<Ruler width={12} />
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
						style={{ minWidth: width, minHeight: 300, height: props.height }}
					>
						{layout.map((item) => {
							const { i: id } = item
							const field = fieldMap[id]
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

							if (type.name == 'Empty') {
								return null
							}

							const label = field.props?.label || type.label || type.name
							return (
								<div
									className={clsx(['field', active == field.id && 'active'])}
									key={id}
								>
									<div className='drag-handle'>
										<Icon
											size={14}
											color={type.color}
											name={
												type.icon && typeof type.icon == 'string'
													? type.icon
													: type.icon &&
													  typeof type.icon == 'object'
													? type.icon.name
													: 'material-format_align_left'
											}
											className='mr_6'
										/>
										{label}
									</div>
									<div className='setting'>
										<Icon
											size={14}
											name='material-content_copy'
											onClick={() => onClone(id)}
										/>
										<Icon
											size={14}
											name='material-settings'
											onClick={() => showPanel(id, field, type)}
										/>
										<Icon
											size={14}
											onClick={() => onRemove(id)}
											name='material-delete'
										/>
									</div>
								</div>
							)
						})}
					</GridLayout>
				</div>
			</div>
		</>
	)
}

export default window.$app.memo(Index)
