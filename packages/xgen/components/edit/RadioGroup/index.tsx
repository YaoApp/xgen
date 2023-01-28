import { Radio } from 'antd'
import { observer } from 'mobx-react-lite'
import { useLayoutEffect, useState } from 'react'
import { container } from 'tsyringe'

import { Item } from '@/components'

import styles from './index.less'
import Model from './model'

import type { Component } from '@/types'
import type { RadioGroupProps } from 'antd'

const { Group } = Radio

interface IProps extends RadioGroupProps, Component.PropsEditComponent {}

const Index = (props: IProps) => {
	const { __bind, __name, itemProps, ...rest_props } = props
	const [x] = useState(() => container.resolve(Model))

	useLayoutEffect(() => {
		x.remote.raw_props = props

		x.remote.init()
	}, [props])

	return (
		<Item className={styles._local} {...itemProps} {...{ __bind, __name }}>
			<Group {...rest_props} options={x.options}></Group>
		</Item>
	)
}

export default new window.$app.Handle(Index).by(observer).by(window.$app.memo).get()
