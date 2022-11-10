import axios from 'axios'
import { find } from 'lodash-es'
import { useEffect, useMemo, useState } from 'react'

export const useColumns = (setting: any) => {
	const { columns, children_columns } = useMemo(() => {
		if (!setting.columns) return { columns: [], children_columns: [] }

		const _columns = setting.columns
		const _layouts = setting.list.layout.columns
		const _children = setting.list.layout?.children || []

		const columns = _layouts.reduce((total: Array<any>, it: any) => {
			const item = {
				..._columns[it.name],
				...it,
				title: it.name
			}

			if (it.width) item['width'] = it.width

			item['key'] = _columns[item.name].bind

			total.push(item)

			return total
		}, [])

		const children_columns = _children.reduce((total: Array<any>, it: any) => {
			const item = {
				..._columns[it.name],
				...it,
				title: it.name
			}

			if (it.width) item['width'] = it.width

			item['key'] = _columns[item.name].bind

			total.push(item)

			return total
		}, [])

		return { columns, children_columns }
	}, [setting])

	return { columns, children_columns }
}

export const useItemText = (it: any, item: any) => {
	const { props } = it.edit
	const [data, setData] = useState<Array<any>>([])

	const getData = async () => {
		let v = ''

		if (props.xProps.remote.query?.useValue) {
			v = `&value=${props.value}`
		}

		const data = await axios.get<any, any>(
			`${props.xProps.remote.api}?select=${props.xProps.remote.query.select.join(',')}${v}`
		)

		setData(data)
	}

	useEffect(() => {
		if (props?.xProps?.remote) {
			getData()
		}

		if (props.options) {
			setData(props.options)
		}
	}, [props])

	const options = useMemo(() => {
		if (!data.length) return []

		if (it.edit.type === 'Select') {
			return data.reduce((total, item) => {
				total.push({
					label: item.name || item.label,
					value: props.string === '1' ? String(item.id || item.value) : item.id || item.value
				})

				return total
			}, [])
		}

		return data
	}, [data, props.string, it.edit.type])

	const text = useMemo(() => {
		if (item[it.key] === undefined) return it.title

		if (it.edit.type === 'Select') {
			const target = find(options, (option) => option.value === item[it.key])
                  
			return target.value
		}

		return item[it.key] !== undefined ? item[it.key] : it.title
      }, [ item, it, options ])
      

	return text
}
