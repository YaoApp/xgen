import { DatePicker } from 'antd'
import moment from 'moment'
import { useEffect, useState } from 'react'

import Item from '@/components/edit/Item'
import { getLocale } from '@umijs/max'

import type { DatePickerProps } from 'antd'
import type { Component } from '@/types'
import type { Moment } from 'moment'

type IProps = DatePickerProps & Component.PropsEditComponent & {}

const CustomDatePicker = (props: DatePickerProps) => {
	const [value, setValue] = useState<Moment>()

	useEffect(() => {
		if (!props.value) return

		setValue(moment(props.value as any))
	}, [props.value])

	const onChange = (v: any) => {
		if (!props.onChange) return

		props.onChange(v, '')

		setValue(v)
	}

	return (
		<DatePicker
			{...props}
			value={value}
			onChange={onChange}
		></DatePicker>
	)
}

const Index = (props: IProps) => {
	const { __bind, __name, __data_item, itemProps, ...rest_props } = props
	const is_cn = getLocale() === 'zh-CN'

	return (
		<Item {...itemProps} {...{ __bind, __name }}>
			<CustomDatePicker
				placeholder={`${is_cn ? '请选择' : 'Please select '}${__name}`}
				{...rest_props}
			></CustomDatePicker>
		</Item>
	)
}

export default window.$app.memo(Index)
