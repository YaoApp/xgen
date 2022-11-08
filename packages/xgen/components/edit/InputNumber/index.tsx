import { InputNumber } from 'antd'

import { Item } from '@/components'
import { getLocale } from '@umijs/max'

import type { InputNumberProps } from 'antd'
import type { Component } from '@/types'

interface IProps extends InputNumberProps, Component.PropsEditComponent {}

const Index = (props: IProps) => {
	const { __bind, __name, itemProps, ...rest_props } = props
	const is_cn = getLocale() === 'zh-CN'

	return (
		<Item {...itemProps} {...{ __bind, __name }}>
			<InputNumber
				placeholder={`${is_cn ? '请输入' : 'Please input '}${__name}`}
				{...rest_props}
			></InputNumber>
		</Item>
	)
}

export default window.$app.memo(Index)
