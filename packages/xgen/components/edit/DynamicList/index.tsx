import axios from 'axios'
import clsx from 'clsx'
import { useEffect, useState } from 'react'

import { Item } from '@/components'

import List from './components/List'
import styles from './index.less'

import type { Component } from '@/types'

interface ICustom {
	setting: string
	type: string
	label: string
	value: any
	query?: any
	disabled?: boolean
	onChange: any
}

interface IProps extends Component.PropsEditComponent, ICustom {}

const Custom = (props: ICustom) => {
	const [setting, setSetting] = useState<any>({})
	const [data, setData] = useState<Array<any>>([])

	const api = {
		setting: `/api/${localStorage.getItem('__api_prefix')}/setting/${props.setting}`
	}

	const getSetting = async () => {
		const data = await axios.get(api.setting)

		setSetting(data)
	}

	useEffect(() => {
		if (!props?.setting) return

		getSetting()
	}, [props.setting])

	useEffect(() => {
		if (!props.value) return

		setData(Array.isArray(props.value) ? props.value : props.value.data)
	}, [props.value])

	return (
		<div className={styles._local}>
			<div
				className={clsx([
					'quick_table_wrap w_100',
					props?.type === 'view' && 'disabled',
					props?.disabled && 'disabled'
				])}
			>
				{setting?.columns && (
					<List
						setting={setting}
						data={data}
						type={props.type}
						label={props.label}
						query={props.query || {}}
						trigger={props.onChange}
					></List>
				)}
			</div>
		</div>
	)
}

const Index = (props: IProps) => {
	const { __bind, __name, __data_item, itemProps, ...rest_props } = props

	return (
		<Item {...itemProps} {...{ __bind, __name }}>
			<Custom {...rest_props}></Custom>
		</Item>
	)
}

export default window.$app.memo(Index)
