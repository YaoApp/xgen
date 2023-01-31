import { useMemoizedFn } from 'ahooks'
import { Switch } from 'antd'

import type { SwitchProps } from 'antd'
import type { Component } from '@/types'

interface IProps extends SwitchProps, Component.PropsViewComponent {
	checkedValue: boolean | string
	unCheckedValue: boolean | string
}

const Index = (props: IProps) => {
	const { __namespace, __primary, __bind, onSave, __value, checkedValue, unCheckedValue, ...rest_props } = props

	const onChange = useMemoizedFn((v: boolean) => {
		onSave({ [__bind]: v ? checkedValue : unCheckedValue })
	})

	return <Switch {...rest_props} checked={__value === checkedValue} onChange={onChange}></Switch>
}

export default window.$app.memo(Index)
