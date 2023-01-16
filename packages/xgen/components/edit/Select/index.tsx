import { Select } from 'antd'
import clsx from 'clsx'
import { observer } from 'mobx-react-lite'
import { useLayoutEffect, useState } from 'react'
import { container } from 'tsyringe'

import { Item } from '@/components'
import { getLocale } from '@umijs/max'

import styles from './index.less'
import Model from './model'

import type { Remote } from '@/types'
import type { SelectProps } from 'antd'

interface IProps extends Remote.IProps, SelectProps {}

const Index = (props: IProps) => {
	const { __bind, __name, itemProps, xProps, ...rest_props } = props
	const [x] = useState(() => container.resolve(Model))
	const is_cn = getLocale() === 'zh-CN'

	useLayoutEffect(() => {
		x.remote.raw_props = props

		x.remote.init()
	}, [])

	return (
		<Item {...itemProps} {...{ __bind, __name }}>
			<Select
				className={clsx([styles._local, rest_props.mode === 'multiple' && styles.multiple])}
				popupClassName={styles._dropdown}
				placeholder={`${is_cn ? '请输入' : 'Please input '}${__name}`}
				options={x.options}
				getPopupContainer={(node) => node.parentNode}
				{...rest_props}
				{...x.target_props}
			></Select>
		</Item>
	)
}

export default new window.$app.Handle(Index).by(observer).by(window.$app.memo).get()
