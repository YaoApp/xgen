import { Panel, Icon, PanelPresets as Presets, PanelFilter as Filter } from '@/widgets'
import GridLayout from 'react-grid-layout'
import { Field, Layout, Setting, Type, Data } from '../../types'
import { Dispatch, SetStateAction, useEffect, useState } from 'react'
import { GenerateID, LayoutToColumns, TypeMappping, UpdatePosition, ValueToLayout } from '../../utils'
import clsx from 'clsx'
import type { Component } from '@/types'
import { IconName, IconSize } from '@/components/edit/FlowBuilder/utils'
import { getLocale } from '@umijs/max'
import { Tooltip } from 'antd'
import Ruler from '../Ruler'
import { useGlobal } from '@/context/app'
import { Color } from '@/utils'

interface IProps {
	width?: number
	height?: number
	contentHeight?: number
	setting?: Setting
	presets?: Component.Request
	value?: Data // initial value
	fixed: boolean
	offsetTop: number
	panelWidth?: number

	onChange?: (v: any, height: number) => void

	toggleSidebar: () => void
	showSidebar: boolean
	fullscreen: boolean
	setFullscreen: (v: boolean) => void
	mask: boolean
	setMask: Dispatch<SetStateAction<boolean>>

	__namespace: string
	__bind: string
}

const Index = (props: IProps) => {
	const { width } = props
	const [layout, setLayout] = useState<Layout[]>([])
	const [fieldMap, setFieldMap] = useState<Record<string, Field>>({})
	const [typeMap, setTypeMap] = useState<Record<string, Type>>({})
	const [value, setValue] = useState<Data | undefined>(props.value)

	// Panel setting
	const [open, setOpen] = useState(false)
	const [type, setType] = useState<Type | undefined>(undefined)
	const [active, setActive] = useState<string | undefined>(undefined)
	const [field, setField] = useState<Field | undefined>(undefined)

	const is_cn = getLocale() === 'zh-CN'
	const defaultLabel = is_cn ? '未命名' : 'Untitled'
	const [isPreset, setIsPreset] = useState(false)
	const [isSetting, setIsSetting] = useState(false)

	const [keywords, setKeywords] = useState<string>('')

	const onPanelChange = (id: string, bind: string, value: any) => {
		if (isSetting) {
			updateForm(bind, value)
			return
		}

		if (field) {
			const props = { ...field.props }
			props[bind] = value
			setField({ ...field, props })

			// Update Mapping
			const mapping = { ...fieldMap }
			mapping[id] = { ...field, props }
			setFieldMap(mapping)
			updateColumns(LayoutToColumns(layout, mapping))
		}
	}

	const afterPanelOpenChange = (open: boolean) => {
		if (!open) {
			props.setMask(true)
			setActive(undefined)
			setIsSetting(false)
			setIsPreset(false)
		}
	}

	const showPanel = (id: string, field: Field, type: Type) => {
		setIsPreset(false)
		setIsSetting(false)
		setField(field)
		setType(type)
		setActive(id)
		props.setMask(true)
		setOpen(true)
	}

	const showPresets = () => {
		setIsPreset(true)
		setIsSetting(false)
		setActive(undefined)
		props.setMask(false)
		setOpen(true)
	}
	const showSettings = () => {
		setIsSetting(true)
		props.setMask(true)
		setIsPreset(false)
		setActive(undefined)
		setOpen(true)
	}

	const hidePanel = () => {
		setOpen(false)
	}

	const getID = () => {
		if (isSetting) return '__settings'
		return active
	}

	const getLabel = () => {
		if (isSetting) return is_cn ? '设置' : 'Settings'
		if (isPreset) return is_cn ? '插入' : 'Insert'

		return field?.props?.label || field?.props?.name || type?.label || (is_cn ? '未命名' : 'Untitled')
	}

	const getData = () => {
		if (isSetting) return { ...(value?.form || {}) }
		return field?.props || {}
	}

	const getActions = () => {
		if (isPreset) {
			return [<Filter key='filter' onChange={(value) => setKeywords(value)} />]
		}

		return undefined
	}

	const getType = () => {
		if (isSetting) return getSetting()
		if (isPreset) return undefined
		return type
	}

	// add addColumn to the layout
	const addColumn = (field: Field) => {
		const maxY = Math.max(...layout.map((item) => item.y))
		const copyField = { ...field }
		copyField.id = GenerateID()
		copyField.x = 0
		copyField.y = maxY + 1

		const newCloumns = [...(value?.columns || []), copyField]
		setValue((value) => ({ ...value, columns: newCloumns }))
		setLayout([
			...layout,
			{
				i: copyField.id,
				x: copyField.x,
				y: copyField.y,
				w: copyField.width || 4,
				h: 1,
				resizeHandles: ['w', 'e'],
				isResizable: field.resizable === undefined ? true : field.resizable
			}
		])
		setFieldMap({ ...fieldMap, [copyField.id]: copyField })
	}

	const getSetting = () => {
		if (!props.setting) return undefined
		if (!props.setting.form) {
			console.error('setting.form not found')
			return undefined
		}

		props.setting.form.forEach((section) => {
			section?.columns?.forEach((item) => {
				const component = props.setting?.fields?.[item.name]
				if (!component) return console.error('Component not found', item.name)
				item.component = component
			})
		})

		return {
			name: is_cn ? '设置' : 'Settings',
			icon: 'icon-sliders',
			props: props.setting.form
		} as Type
	}

	// Update the value
	const updateColumns = (columns: Data['columns']) => {
		setValue((value) => ({ ...value, columns: [...columns] }))
	}

	// Update form setting
	const updateForm = (bind: string, value: any) => {
		setValue((v) => {
			v = v || { columns: [], form: {} }
			const form = { ...(v.form || {}) }
			form[bind] = value
			return { ...v, form }
		})
	}

	useEffect(() => {
		const maxY = Math.max(...layout.map((item) => item.y))
		const height = (maxY + 1) * (42 + 10)
		props.onChange && props.onChange(value, height)
	}, [value])

	// Update value when set from outside
	useEffect(() => {
		if (props.setting) {
			const mappping = TypeMappping(props.setting)
			setTypeMap(mappping)
		}
	}, [props.setting])

	useEffect(() => {
		if (props.value || props.setting?.defaultValue) {
			const res = ValueToLayout(props.value?.columns, props.setting?.defaultValue?.columns || [])
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
		const columns = LayoutToColumns(layout, mapping)
		updateColumns(columns)
	}

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
			const maxY = Math.max(...layout.map((item) => item.y))

			const copyField = { ...fieldMap[key] }
			copyField.id = GenerateID()
			copyField.x = 0
			copyField.y = maxY + 1

			const newCloumns = [...(value?.columns || []), copyField]
			setValue((value) => ({ ...value, columns: newCloumns }))
			setLayout([
				...layout,
				{
					i: copyField.id,
					x: copyField.x,
					y: copyField.y,
					w: copyField.width || 4,
					h: 1,
					resizeHandles: ['w', 'e'],
					isResizable: copyField.resizable === undefined ? true : copyField.resizable
				}
			])
			setFieldMap({ ...fieldMap, [copyField.id]: copyField })
			showPanel(copyField.id, copyField, typeMap[copyField.type])
		}
	}

	// Drop the item add the item to the layout
	const onDrop = (layout: Layout[], layoutItem: GridLayout.Layout, e: any) => {
		// Drop from preset
		const payload = e.dataTransfer.getData('application/form/preset')
		if (payload) {
			let data: Record<string, any> = {}
			try {
				data = JSON.parse(payload)
			} catch (e: any) {
				console.error(`Error parsing JSON data: ${e.message}`)
				return
			}

			if (!data.columns) {
				console.error('Columns not found in payload')
				return
			}

			setValue((value) => {
				value = value || { columns: [], form: {} }
				const newColumns = [...value.columns, ...data.columns]
				const res = ValueToLayout(newColumns, [], { x: layoutItem.x, y: layoutItem.y })
				setLayout(res.layout)
				setFieldMap(res.mapping)
				return { ...value, columns: newColumns }
			})
			return
		}

		// Drop from type
		const raw = e.dataTransfer.getData('application/form/type') || ''
		let data: Record<string, any> = {}
		try {
			data = JSON.parse(raw)
		} catch (e: any) {
			console.error(`Error parsing JSON data: ${e.message}`)
			return
		}

		addColumn({
			id: GenerateID(),
			type: data.type,
			x: layoutItem.x,
			y: layoutItem.y,
			resizable: data.resizable === undefined ? true : data.resizable,
			width: data.width || 4,
			props: data.props || {}
		})
		// showPanel(field.id, field, typeMap[field.type])
	}

	// Remove the item
	const onRemove = (key: string) => {
		// Update Layout
		const newLayout: Layout[] = layout.filter((item) => item.i !== key)
		const mapping = UpdatePosition(fieldMap, newLayout)
		setFieldMap(mapping)
		delete mapping[key]

		// Update Value
		const newCloumns = Object.values(mapping)
		setValue((value) => ({ ...value, columns: newCloumns }))
	}

	// onDropDragOver: (e: DragOverEvent) => Layout
	const onDropDragOver = (e: any) => ({ w: 4, h: 1 })

	// Get the text color
	const global = useGlobal()
	const TextColor = (color?: string) => {
		return color && color != '' ? Color(color, global.theme) : Color('text', global.theme)
	}

	return (
		<>
			<Panel
				open={open}
				onClose={hidePanel}
				onChange={onPanelChange}
				afterOpenChange={afterPanelOpenChange}
				id={getID()}
				label={getLabel()}
				data={getData()}
				type={getType()}
				actions={getActions()}
				fixed={props.fixed}
				mask={props.mask}
				width={props.panelWidth || 420}
				offsetTop={props.offsetTop}
				icon={isPreset ? 'icon-plus-circle' : undefined}
				children={
					isPreset ? (
						<Presets
							keywords={keywords}
							transfer='application/form/preset'
							__namespace={props.__namespace}
							__bind={props.__bind}
							presets={props.presets}
						/>
					) : undefined
				}
			/>
			<div className='title-bar' style={{ width: props.width }}>
				<div className='head'>
					<div className='title' onClick={showSettings}>
						<Icon
							name={IconName(props.value?.form?.icon)}
							size={IconSize(props.value?.form?.icon)}
							style={{ marginRight: 4 }}
						/>
						{props.value?.form?.label || props.value?.form?.name || defaultLabel}
					</div>
					<div className='actions'>
						<Tooltip
							title={is_cn ? '插入' : 'Insert'}
							placement={props.fullscreen ? 'bottom' : 'top'}
						>
							<a style={{ marginRight: 12, marginTop: 2 }} onClick={showPresets}>
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
									style={{ marginRight: 12, marginTop: 2 }}
									onClick={() => props.setFullscreen(false)}
								>
									<Icon name='icon-minimize' size={16} />
								</a>
							</Tooltip>
						)}
					</div>
				</div>
				<div className='relative canvas'>
					<Ruler height={props.height} contentHeight={props.contentHeight} />
					<GridLayout
						className='layout'
						layout={layout}
						cols={12}
						rowHeight={42}
						width={(width || 300) - 32}
						onDrop={onDrop}
						onDropDragOver={onDropDragOver}
						onLayoutChange={onLayoutChange}
						isDroppable={true}
						onDrag={onDrag}
						onResize={onResize}
						draggableHandle='.drag-handle'
						style={{ minWidth: (width || 300) - 32, minHeight: 300, height: props.height }}
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
										<a
											onMouseDown={(event) => {
												event.stopPropagation()
												showPanel(id, field, type)
											}}
											style={{ color: TextColor(type.color) }}
										>
											{label}
										</a>
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
