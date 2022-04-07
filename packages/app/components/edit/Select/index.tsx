import { Select } from 'antd'
import { observer } from 'mobx-react-lite'
import { useLayoutEffect, useState } from 'react'
import { container } from 'tsyringe'

import Item from '@/components/edit/Item'
import { getLocale } from '@umijs/max'

import styles from './index.less'
import Model from './model'

const { Option } = Select

import type { SelectProps } from 'antd'
import type { IPropsEditComponent, Component } from '@/types'

export interface IProps extends SelectProps, IPropsEditComponent {
	xProps: {
		remote?: Component.Request
		search?: Component.Request & { key: string }
	}
}

const Index = (props: IProps) => {
	const { __bind, __name, __data_item, itemProps, xProps, ...rest_props } = props
	const is_cn = getLocale() === 'zh-CN'
	const [x] = useState(() => container.resolve(Model))
	let Options: Array<JSX.Element> | null = null

	useLayoutEffect(() => {
		x.raw_props = props

		x.init()
	}, [])

	if (!props.options) {
		Options = x.options.map((item) => (
			<Option key={item.value} value={item.value}>
				{item.label}
			</Option>
		))
	}

	return (
		<Item {...itemProps} {...{ __bind, __name }}>
			<Select
				className={styles._local}
				dropdownClassName={styles._dropdown}
				placeholder={`${is_cn ? '请输入' : 'Please input '}${__name}`}
				{...rest_props}
				{...x.target_props}
			>
				{Options}
			</Select>
		</Item>
	)
}

export default new window.$app.Handle(Index).by(observer).by(window.$app.memo).get()
