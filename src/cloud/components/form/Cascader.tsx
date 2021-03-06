import { Cascader } from 'antd'
import { useMemo, useState } from 'react'
import { request } from 'umi'

import { Item } from '@/components'

import type { CascaderProps } from 'antd'

interface IProps extends CascaderProps<any> {
	label?: string
	options: Array<any>
	remote: {
		api: string
		query: {
			select: Array<string>
		}
	}
}

const Index = (props: IProps) => {
	const [data, setData] = useState<Array<any>>([])

	const getData = async () => {
		const data = await request(
			`${props.remote.api}?select=${props.remote.query.select.join(',')}`
		)

		setData(data)
	}

	const real_props = useMemo(() => {
		const _props: any = { ...props }

		if (_props.remote) {
			getData()
		}

		if (_props.options) {
			setData(_props.options)
		}

		if (_props.showSearch) {
			_props.showSearch = (input: string, option: any) => {
				return option.some(
					(item: any) =>
						item.label.toLowerCase().indexOf(input.toLowerCase()) > -1
				)
			}
		}

		return _props
	}, [props])

	return (
		<Item {...(props as any)}>
			<Cascader
				{...real_props}
				options={data}
				placeholder={props.placeholder || `请选择${props.label}`}
				allowClear
			></Cascader>
		</Item>
	)
}

export default window.$app.memo(Index)
