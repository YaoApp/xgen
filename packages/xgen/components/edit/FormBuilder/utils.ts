import axios from 'axios'
import { Field, Layout, Presets, Remote, Setting, Type } from './types'
import { nanoid } from 'nanoid'

export const GetSetting = async (setting?: Remote | Setting): Promise<Setting> => {
	if (setting && 'api' in setting) {
		setting = setting as Remote
		const api = setting.api
		const params = { ...setting.params }
		try {
			const res = await axios.get<any, Setting>(api, { params })
			return Promise.resolve(res)
		} catch (err) {
			console.error('[GetSetting] remote search error', err)
			return Promise.reject(err)
		}
	}
	return Promise.resolve(setting as Setting)
}

export const GetPresets = async (presets?: Remote | Presets, v?: string): Promise<Presets> => {
	// Typeof Remote
	if (presets && 'api' in presets) {
		presets = presets as Remote
		const api = presets.api
		const params = { ...presets.params }
		if (v) {
			params.keywords = v
		}
		try {
			const res = await axios.get<any, Presets>(api, { params })
			return Promise.resolve(res)
		} catch (err) {
			console.error('[GetSetting] remote search error', err)
			return Promise.reject(err)
		}
	} else {
		presets = presets as Presets
		// Filter by keywords
		if (v) {
			return Promise.resolve(
				presets.filter((item) => item.props?.label?.includes(v) || item.props?.name?.includes(v))
			)
		}
	}

	return Promise.resolve(presets as Presets)
}

export const TypeMappping = (setting: Setting): Record<string, Type> => {
	const mapping: Record<string, Type> = {
		Empty: { name: 'Empty', label: '', props: [] }
	}
	setting.types?.forEach((type) => {
		if (type.props) {
			type.props.forEach((prop) => {
				prop.columns.forEach((column) => {
					if (setting.fields?.[column.name]) {
						column.component = setting.fields[column.name]
					}
				})
			})
		}
		mapping[type.name] = type
	})
	return mapping
}

export const LayoutToColumns = (
	layout: Layout[],
	mapping: Record<string, Field>,
	layoutWidth: number = 12
): Field[] => {
	const value: Field[] = []
	const lines: Layout[][] = []
	layout.forEach((item) => {
		if (!lines[item.y]) {
			lines[item.y] = []
		}
		lines[item.y].push(item)
	})

	// sort by x
	lines.forEach((line) => {
		line.sort((a, b) => a.x - b.x)
	})

	// sort by y
	lines.sort((a, b) => a[0].y - b[0].y)

	// convert to value padding with empty if has empty space in the middle of the line
	lines.forEach((line) => {
		let x = 0
		line.forEach((item) => {
			if (item.x > x) {
				const empty: Field = {
					type: 'Empty',
					width: item.x - x,
					x,
					y: item.y
				}
				value.push(empty)
			}
			const field = mapping[item.i]
			if (field) {
				value.push(field)
			}
			x = item.x + item.w
		})
		if (x < layoutWidth) {
			const empty: Field = {
				type: 'Empty',
				width: layoutWidth - x,
				x,
				y: line[0].y
			}
			value.push(empty)
		}
	})

	// Remove the last empty
	const last = value[value.length - 1]
	if (last && last.type === 'Empty') {
		value.pop()
	}

	// Remove field id, x, y
	value.forEach((item) => {
		delete item.x
		delete item.y
	})
	return value
}

export const ValueToLayout = (
	value?: Field[],
	defaultValue?: Field[],
	offsets?: { x: number; y: number }
): { layout: Layout[]; mapping: Record<string, Field> } => {
	if (Array.isArray(value)) {
		return _valueToLayout(value, offsets)
	}

	if (Array.isArray(defaultValue)) {
		return _valueToLayout(defaultValue, offsets)
	}

	return { layout: [], mapping: {} }
}

export const UpdatePosition = (mapping: Record<string, Field>, layout: Layout[]): Record<string, Field> => {
	const newMapping: Record<string, Field> = {}
	layout.forEach((item) => {
		const field = mapping[item.i]
		if (!field) return false

		field.id = item.i
		field.x = item.x
		field.y = item.y
		field.width = item.w
		newMapping[item.i] = field
	})
	return newMapping
}

export const GenerateID = (): string => {
	return '_' + nanoid() + new Date().valueOf()
}

const _valueToLayout = (
	value?: Field[],
	offsets?: { x: number; y: number }
): { layout: Layout[]; mapping: Record<string, Field> } => {
	if (!Array.isArray(value)) {
		return { layout: [], mapping: {} }
	}
	const mapping: Record<string, Field> = {}
	const layout: Layout[] = []

	let cols = 0 + (offsets?.x || 0)
	let y = 0 + (offsets?.y || 0)
	value.map((item, index) => {
		if (!item) return false
		const id = item.id || GenerateID()
		item.id = id
		mapping[id] = item
		if (item.x === undefined) {
			item.x = cols
		}
		if (item.y === undefined) {
			item.y = y
		}

		cols = cols + (item.width || 4)
		if (cols >= 12) {
			cols = 0
			y = y + 1
		}

		layout.push({
			i: id,
			x: item.x || 0,
			y: item.y || 0,
			w: item.width || 4,
			h: 1,
			resizeHandles: ['w', 'e'],
			isResizable: item.resizable === undefined ? true : item.resizable
		})
	})
	return { layout, mapping }
}
