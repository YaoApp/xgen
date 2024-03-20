import { DatePicker } from 'antd'
import moment from 'moment'
import { useEffect, useState } from 'react'

import { Item } from '@/components'
import { getLocale } from '@umijs/max'

import type { DatePickerProps } from 'antd'
import type { Component } from '@/types'
import type { Moment, MomentInput } from 'moment'

type IProps = DatePickerProps & Component.PropsEditComponent & {}

const Custom = window.$app.memo((props: DatePickerProps) => {
	const [value, setValue] = useState<Moment>()

	useEffect(() => {
		if (!props.value) return

		setValue(moment(props.value as MomentInput))
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
			getPopupContainer={(node) => node.parentNode as HTMLElement}
			onChange={onChange}
		></DatePicker>
	)
})

const Index = (props: IProps) => {
	const { __bind, __name, itemProps, ...rest_props } = props
	const is_cn = getLocale() === 'zh-CN'

	return (
		<Item {...itemProps} {...{ __bind, __name }}>
			<Custom placeholder={`${is_cn ? '请选择' : 'Please select '}${__name}`} {...rest_props}></Custom>
		</Item>
	)
}

export default window.$app.memo(Index)
