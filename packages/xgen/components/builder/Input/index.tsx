import { Input } from 'antd'

import Item from '../Item'
import type { InputProps } from 'antd'
import type { Component } from '@/types'

interface IProps extends InputProps, Component.PropsEditComponent {}

const Index = (props: IProps) => {
	const { __bind, __name, onChange, ...rest_props } = props
	return (
		<Item {...{ __bind, __name }}>
			<Input
				{...rest_props}
				name={__bind}
				onChange={(e: any) => onChange && onChange(e.target.value)}
			></Input>
		</Item>
	)
}

export default window.$app.memo(Index)
