import { DatePicker } from 'antd'
import moment from 'moment'
import { useEffect, useState } from 'react'

import Item from '@/components/edit/Item'

import type { TimeRangePickerProps } from 'antd'
import type { Component } from '@/types'
import type { Moment, MomentInput } from 'moment'

const { RangePicker } = DatePicker

type IProps = TimeRangePickerProps & Component.PropsEditComponent & {}

const Custom = (props: TimeRangePickerProps) => {
	const [value, setValue] = useState<[Moment, Moment]>()

	useEffect(() => {
		if (!props.value) return

		setValue([moment(props.value[0] as MomentInput), moment(props.value[1] as MomentInput)])
	}, [props.value])

	const onChange = (v: any) => {
		if (!props.onChange) return

		props.onChange(
			[
				moment(v[0]).format(props?.format as string) as any,
				moment(v[1]).format(props?.format as string) as any
			],
			null as any
		)

		setValue(v)
	}

	return (
		<RangePicker
			{...props}
			value={value}
			onChange={onChange}
		></RangePicker>
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
