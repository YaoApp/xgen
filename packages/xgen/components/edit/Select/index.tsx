import { useMemoizedFn } from 'ahooks'
import { message, Select } from 'antd'
import clsx from 'clsx'
import { find } from 'lodash-es'
import { toJS } from 'mobx'
import { observer } from 'mobx-react-lite'
import { Fragment, useLayoutEffect, useMemo, useState } from 'react'
import { container } from 'tsyringe'

import { Item } from '@/components'
import { getLocale } from '@umijs/max'

import { Extend } from './components'
import styles from './index.less'
import Model from './model'

import type { IProps } from './types'
import type { SelectProps } from 'antd'

const Index = (props: IProps) => {
	const { __bind, __name, itemProps, xProps, extend, ...rest_props } = props
	const [x] = useState(() => container.resolve(Model))
	const is_cn = getLocale() === 'zh-CN'

	useLayoutEffect(() => {
		x.remote.raw_props = props

		x.remote.init()
	}, [])

	const addOptionItem = useMemoizedFn((label, value) => {
		if (find(x.options, (item) => item.label === label || item.value === value))
			return message.warning('该选项已存在')

		x.remote.options.unshift({ label, value })
	})

	const extra_props = useMemo(() => {
		if (!extend) return {}

		return {
			dropdownRender: (items) => (
				<Fragment>
					{items}
					<Extend addOptionItem={addOptionItem}></Extend>
				</Fragment>
			)
		} as SelectProps
	}, [extend])

	return (
		<Item {...itemProps} {...{ __bind, __name }}>
			<Select
				className={clsx([styles._local, rest_props.mode === 'multiple' && styles.multiple])}
				popupClassName={styles._dropdown}
				placeholder={`${is_cn ? '请输入' : 'Please input '}${__name}`}
				options={toJS(x.options)}
				getPopupContainer={(node) => node.parentNode}
				{...extra_props}
				{...rest_props}
				{...x.target_props}
			></Select>
		</Item>
	)
}

export default new window.$app.Handle(Index).by(observer).by(window.$app.memo).get()
