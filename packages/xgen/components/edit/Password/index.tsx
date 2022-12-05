import { Input } from 'antd'

import { Item } from '@/components'
import { getLocale } from '@umijs/max'

import type { InputProps } from 'antd'
import type { Component } from '@/types'

const { Password } = Input

interface IProps extends InputProps, Component.PropsEditComponent {}

const Index = (props: IProps) => {
	const { __bind, __name, itemProps, ...rest_props } = props
	const is_cn = getLocale() === 'zh-CN'

	return (
		<Item {...itemProps} {...{ __bind, __name }}>
			<Password placeholder={`${is_cn ? '请输入' : 'Please input '}${__name}`} {...rest_props}></Password>
		</Item>
	)
}

export default window.$app.memo(Index)
