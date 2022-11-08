import { useMemoizedFn } from 'ahooks'
import { Switch } from 'antd'

import type { SwitchProps } from 'antd'
import type { Component } from '@/types'

interface IProps extends SwitchProps, Component.PropsViewComponent {
	checkedValue: boolean | string
	unCheckedValue: boolean | string
}

const Index = (props: IProps) => {
	const { __namespace, __primary, __bind, __data_item, __value, checkedValue, unCheckedValue, ...rest_props } =
		props

	const onChange = useMemoizedFn((v: boolean) => {
		window.$app.Event.emit(`${__namespace}/save`, {
			[__primary]: __data_item[__primary],
			[__bind]: v ? checkedValue : unCheckedValue
		})
	})

	return <Switch {...rest_props} checked={__value === checkedValue} onChange={onChange}></Switch>
}

export default window.$app.memo(Index)
