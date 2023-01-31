import { useMemoizedFn } from 'ahooks'
import { Checkbox } from 'antd'

import type { CheckboxProps } from 'antd'
import type { Component } from '@/types'
import type { CheckboxChangeEvent } from 'antd/es/checkbox'

interface IProps extends CheckboxProps, Component.PropsViewComponent {
	text?: string
}

const Index = (props: IProps) => {
	const { __namespace, __primary, __bind, __value, onSave, text, ...rest_props } = props

	const onChange = useMemoizedFn((e: CheckboxChangeEvent) => {
		onSave({ [__bind]: e.target.checked })
	})

	return (
		<Checkbox {...rest_props} checked={__value} onChange={onChange}>
			{text}
		</Checkbox>
	)
}

export default window.$app.memo(Index)
