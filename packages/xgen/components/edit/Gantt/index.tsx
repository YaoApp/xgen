import { useMemoizedFn } from 'ahooks'
import { useEffect, useState } from 'react'

import { Item } from '@/components'
import PureGantt from '@/components/base/PureGantt'

import type { Component } from '@/types'

interface ICustom {
	value?: any
	disabled?: boolean
	onChange?: (v: any) => void
}

interface IProps extends Component.PropsEditComponent, ICustom {}

const List = window.$app.memo((props: ICustom) => {
	const [value, setValue] = useState([])

	useEffect(() => {
		if (!props.value) return

		setValue(props.value)
	}, [props.value])

	const onChange = useMemoizedFn((v: any) => {
		if (!props.onChange) return

		props.onChange(v)

		setValue(v)
	})

	return <PureGantt></PureGantt>
})

const Custom = (props: ICustom) => <List {...props}></List>

const Index = (props: IProps) => {
      const { __namespace, __bind, __name, itemProps, ...rest_props } = props
      
	return (
		<Item {...itemProps} {...{ __bind, __name }}>
			<Custom {...rest_props}></Custom>
		</Item>
	)
}

export default window.$app.memo(Index)
