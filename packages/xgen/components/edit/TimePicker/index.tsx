import { TimePicker } from 'antd'
import moment from 'moment'
import { useEffect, useState } from 'react'
import { Else, If, Then } from 'react-if'

import { Item } from '@/components'

import type { TimeRangePickerProps, TimePickerProps } from 'antd'
import type { Component } from '@/types'
import type { Moment, MomentInput } from 'moment'

const { RangePicker } = TimePicker

interface ICustom {
	range?: boolean
	outputFormat?: string
}

type IProps = (TimeRangePickerProps | TimePickerProps) & Component.PropsEditComponent & ICustom
type CustomTimeRangePickerProps = TimeRangePickerProps & { outputFormat?: string }

const CustomRangePicker = window.$app.memo((props: CustomTimeRangePickerProps) => {
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

const CustomTimePicker = window.$app.memo((props: TimePickerProps) => {
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

	return <TimePicker {...props} value={value} onChange={onChange}></TimePicker>
})

const Index = (props: IProps) => {
	const { __bind, __name, itemProps, range, ...rest_props } = props

	return (
		<If condition={range}>
			<Then>
				<Item {...itemProps} {...{ __bind, __name }}>
					<CustomRangePicker {...(rest_props as TimeRangePickerProps)}></CustomRangePicker>
				</Item>
			</Then>
			<Else>
				<Item {...itemProps} {...{ __bind, __name }}>
					<CustomTimePicker {...(rest_props as TimePickerProps)}></CustomTimePicker>
				</Item>
			</Else>
		</If>
	)
}

export default window.$app.memo(Index)
