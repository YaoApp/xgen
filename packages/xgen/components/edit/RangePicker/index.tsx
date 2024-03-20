import { DatePicker } from 'antd'
import moment from 'moment'
import { useEffect, useState } from 'react'

import { Item } from '@/components'

import type { TimeRangePickerProps } from 'antd'
import type { Component } from '@/types'
import type { Moment, MomentInput } from 'moment'

const { RangePicker } = DatePicker

interface IProps extends TimeRangePickerProps, Component.PropsEditComponent {
	outputFormat?: string
}
type CustomTimeRangePickerProps = TimeRangePickerProps & { outputFormat?: string }

const Custom = window.$app.memo((props: CustomTimeRangePickerProps) => {
	const [value, setValue] = useState<[Moment, Moment]>()

	useEffect(() => {
		if (!props.value) return

		setValue([moment(props.value[0] as MomentInput), moment(props.value[1] as MomentInput)])
	}, [props.value])

	const onChange = (v: any) => {
		if (!props.onChange) return

		props.onChange(
			[
				moment(v[0]).format(props?.outputFormat as string) as any,
				moment(v[1]).format(props?.outputFormat as string) as any
			],
			null as any
		)

		setValue(v)
	}

	return (
		<RangePicker
			{...props}
			value={value}
			getPopupContainer={(node) => node.parentNode as HTMLElement}
			onChange={onChange}
		></RangePicker>
	)
})

const Index = (props: IProps) => {
	const { __bind, __name, itemProps, ...rest_props } = props

	return (
		<Item {...itemProps} {...{ __bind, __name }}>
			<Custom {...rest_props}></Custom>
		</Item>
	)
}

export default window.$app.memo(Index)
