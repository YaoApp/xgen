import { useMemoizedFn } from 'ahooks'
import { toJS } from 'mobx'
import { observer } from 'mobx-react-lite'
import { useEffect, useLayoutEffect, useState } from 'react'
import { container } from 'tsyringe'

import { Item } from '@/components'
import PureList from '@/components/base/PureList'

import styles from './index.less'
import Model from './model'

import type { Component } from '@/types'

interface ICustom {
	name: string
	value?: any
	disabled?: boolean
	showLabel?: boolean
	hasChildren?: boolean
	onChange?: (v: any) => void
	[item: string]: any
}

interface IProps extends Component.PropsEditComponent, ICustom {}

const List = window.$app.memo(
	observer((props: ICustom) => {
		const { name, showLabel, hasChildren } = props
		const [x] = useState(() => container.resolve(Model))
		const [value, setValue] = useState([])

		useLayoutEffect(() => x.init(props), [name])
		useEffect(() => {
			if (!props.value) return

			setValue(Array.isArray(props.value) ? props.value : props.value.data)
		}, [props.value])

		const onChange = useMemoizedFn((v: any) => {
			if (!props.onChange) return

			props.onChange(v)

			setValue(v)
		})

		return (
			<PureList
				setting={toJS(x.columns)}
				props={x.listProps}
				list={value}
				showLabel={showLabel}
				hasChildren={hasChildren}
				onChangeForm={onChange}
			></PureList>
		)
	})
)

const Custom = (props: ICustom) => <List {...props}></List>

const Index = (props: IProps) => {
	const { __bind, __name, itemProps, ...rest_props } = props

	return (
		<Item
			className={styles._local}
			{...itemProps}
			{...{ __bind, __name }}
			style={{ marginBottom: rest_props?.disabled ? 16 : 4 }}
		>
			<Custom {...rest_props}></Custom>
		</Item>
	)
}

export default window.$app.memo(Index)
