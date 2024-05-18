import { Radio } from 'antd'
import { observer } from 'mobx-react-lite'
import { useEffect, useLayoutEffect, useState } from 'react'
import { container } from 'tsyringe'

import Item from '../Item'

import styles from './index.less'
import Model from './model'

import type { Component } from '@/types'
import type { RadioGroupProps } from 'antd'

const { Group } = Radio

interface IProps extends RadioGroupProps, Component.PropsEditComponent {}

const Index = (props: IProps) => {
	const { __bind, __name, onChange, itemProps, ...rest_props } = props
	const [x] = useState(() => container.resolve(Model))

	const [value, setValue] = useState(props.value)
	useLayoutEffect(() => {
		x.remote.raw_props = props
		x.remote.init()
	}, [props])

	useEffect(() => {
		if (props.value === undefined || props.value === null) {
			setValue(props.defaultValue || null)
			return
		}
		setValue(props.value)
	}, [props.value])

	const onGroupChange = (e: any) => {
		onChange?.(e.target.value)
	}

	return (
		<Item {...{ __bind, __name }}>
			<Group
				className={styles._local}
				value={value}
				onChange={onGroupChange}
				{...rest_props}
				options={x.options}
			></Group>
		</Item>
	)
}

export default new window.$app.Handle(Index).by(observer).by(window.$app.memo).get()
