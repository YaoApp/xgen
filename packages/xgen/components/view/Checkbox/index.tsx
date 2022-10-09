import { useMemoizedFn } from 'ahooks'
import { Checkbox } from 'antd'

import type { CheckboxProps } from 'antd'
import type { Component } from '@/types'
import type { CheckboxChangeEvent } from 'antd/es/checkbox'

interface IProps extends CheckboxProps, Component.PropsViewComponent {
	text?: string
}

const Index = (props: IProps) => {
	const { __namespace, __primary, __bind, __data_item, __value, text, ...rest_props } = props

	const onChange = useMemoizedFn((e: CheckboxChangeEvent) => {
		window.$app.Event.emit(`${__namespace}/save`, {
			[__primary]: __data_item[__primary],
			[__bind]: e.target.checked
		})
	})

	return (
		<Checkbox {...rest_props} checked={__value} onChange={onChange}>
			{text}
		</Checkbox>
	)
}

export default window.$app.memo(Index)
