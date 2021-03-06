import { Select } from 'antd'
import { throttle } from 'lodash-es'
import qs from 'query-string'
import { useMemo, useState } from 'react'
import { request } from 'umi'

import { Item } from '@/components'

import type { SelectProps } from 'antd'

const { Option } = Select

interface IProps extends SelectProps<any> {
	name: string
	bind?: string
	label?: string
	string?: '1' | '0' | undefined
	value: string
	rules: Array<any>
	remote: {
		api: string
		query: {
			useValue?: boolean
			select: Array<string>
		}
	}
	search: {
		api: string
		key: string
	}
	options: Array<any>
}

const Index = (props: IProps) => {
	const [data, setData] = useState<Array<any>>([])

	const getData = async () => {
		let v = ''
		let select = ''
		let query_string = ''

		if (props.remote?.query) {
			const { select, useValue, ...other_query } = props.remote.query

			query_string = '&' + qs.stringify(other_query)
		}

		if (props.remote?.query?.useValue) {
			v = `&value=${props.value}`
		}

		if (props.remote?.query?.select) {
			select = `select=${props.remote.query.select.join(',')}`
		}

		const data = await request(`${props.remote.api}?${select}${v}${query_string}`)

		setData(data)
	}

	const real_props = useMemo(() => {
		const _props = { ...props }

		if (_props.remote) {
			getData()
		}

		if (_props.options) {
			setData(_props.options)
		}

		if (_props.showSearch) {
			_props.filterOption = (input, option) => {
				return (
					(option?.children as any)
						?.toLowerCase()
						.indexOf(input.toLowerCase()) >= 0
				)
			}
		}

		if (props.search) {
			_props.onSearch = throttle(
				async (v: string) => {
					if (!v) return setData([])

					const data = await request(
						`${props.search.api}?${props.search.key}=${v}`
					)

					setData(data)
				},
				800,
				{ leading: false }
			)
		}

		return _props
	}, [props])

	return (
		<Item {...(props as any)}>
			<Select
				{...real_props}
				placeholder={props.placeholder || `请选择${props.label}`}
				allowClear
			>
				{data.map(
					(item: { id: number; name: string; label?: string; value?: any }) => (
						<Option
							key={item.id || item.value}
							value={
								props.string === '1'
									? String(item.id || item.value)
									: item.id || item.value
							}
						>
							{item.name || item.label}
						</Option>
					)
				)}
			</Select>
		</Item>
	)
}

export default window.$app.memo(Index)
