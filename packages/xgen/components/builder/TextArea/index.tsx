import { Input } from 'antd'

import Item from '../Item'
import type { InputProps } from 'antd'
import type { TextAreaProps } from 'antd/lib/input/TextArea'
import type { Component } from '@/types'

interface IProps extends TextAreaProps, Component.PropsEditComponent {}

const { TextArea } = Input

const Index = (props: IProps) => {
	const { __bind, __name, onChange, ...rest_props } = props

	return (
		<Item {...{ __bind, __name }}>
			<TextArea
				{...rest_props}
				name={__bind}
				onChange={(e: any) => onChange && onChange(e.target.value)}
			></TextArea>
		</Item>
	)
}

export default window.$app.memo(Index)
