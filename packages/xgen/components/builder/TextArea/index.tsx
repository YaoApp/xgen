import { Input } from 'antd'

import Item from '../Item'
import type { InputProps } from 'antd'
import type { TextAreaProps } from 'antd/lib/input/TextArea'
import type { Component } from '@/types'

interface IProps extends TextAreaProps, Component.PropsEditComponent {}

const { TextArea } = Input

const Index = (props: IProps) => {
	const { __bind, __name, __namespace, onChange, ...rest_props } = props

	return (
		<Item {...{ __bind, __name, __namespace }}>
			<TextArea
				id={`${__namespace || ''}.${__bind}`}
				name={__bind}
				onChange={(e: any) => onChange && onChange(e.target.value)}
				{...rest_props}
			></TextArea>
		</Item>
	)
}

export default window.$app.memo(Index)
