import { Input } from 'antd'

import { Item } from '@/components'
import { getLocale } from '@umijs/max'

import type { TextAreaProps } from 'antd/lib/input/TextArea'
import type { Component } from '@/types'

const { TextArea } = Input

interface IProps extends TextAreaProps, Component.PropsEditComponent {}

const Index = (props: IProps) => {
	const { __bind, __name, itemProps, ...rest_props } = props
	const is_cn = getLocale() === 'zh-CN'

	return (
		<Item {...itemProps} {...{ __bind, __name }}>
			<TextArea placeholder={`${is_cn ? '请输入' : 'Please input '}${__name}`} {...rest_props}></TextArea>
		</Item>
	)
}

export default window.$app.memo(Index)
