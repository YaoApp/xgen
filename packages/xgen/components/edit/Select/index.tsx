import { useMemoizedFn } from 'ahooks'
import { message, Select } from 'antd'
import clsx from 'clsx'
import { find } from 'lodash-es'
import { observer } from 'mobx-react-lite'
import { Fragment, useEffect, useLayoutEffect, useMemo, useState } from 'react'
import { container } from 'tsyringe'

import { Item } from '@/components'
import { getLocale } from '@umijs/max'

import { Extend } from './components'
import styles from './index.less'
import Model from './model'

import type { IProps, ICustom } from './types'
import type { SelectProps } from 'antd'

const Custom = window.$app.memo((props: ICustom) => {
	const { __name, value: __value, xProps, ...rest_props } = props
	const [value, setValue] = useState<SelectProps['value']>()
	const is_cn = getLocale() === 'zh-CN'

	useEffect(() => {
		if (__value === undefined || __value === null) return

		setValue(__value)
	}, [props.mode, __value])

	const onChange: SelectProps['onChange'] = (v) => {
		if (!props.onChange) return

		// @ts-ignore
		props.onChange(v)

		setValue(v)
	}

	return (
		<Select
			className={clsx([styles._local, props.mode === 'multiple' && styles.multiple])}
			popupClassName={styles._dropdown}
			placeholder={`${is_cn ? '请选择' : 'Please select '}${__name}`}
			getPopupContainer={(node) => node.parentNode}
			value={value}
			onChange={onChange}
			{...rest_props}
		></Select>
	)
})

const Index = (props: IProps) => {
	const {
		__bind,
		__name,
		itemProps,
		extend,
		extendValue,
		extendValuePlaceholder,
		extendLabelPlaceholder,
		...rest_props
	} = props
	const [x] = useState(() => container.resolve(Model))

	useLayoutEffect(() => {
		x.remote.raw_props = props

		x.remote.init()
	}, [props])

	const addOptionItem = useMemoizedFn((label, value) => {
		if (find(x.options, (item) => item.label === label || item.value === value))
			return message.warning('该选项已存在')

		x.remote.options.unshift({ label, value })
	})

	const extra_props = useMemo(() => {
		if (!extend && !extendValue) return {}
		return {
			dropdownRender: (items) => (
				<Fragment>
					{items}
					<Extend
						addOptionItem={addOptionItem}
						valueOnly={extendValue}
						valuePlaceholder={extendValuePlaceholder}
						labelPlaceholder={extendLabelPlaceholder}
					></Extend>
				</Fragment>
			)
		} as SelectProps
	}, [extend])

	return (
		<Item {...itemProps} {...{ __bind, __name }}>
			<Custom
				{...rest_props}
				{...extra_props}
				{...x.target_props}
				__name={__name}
				options={x.options}
			></Custom>
		</Item>
	)
}

export default new window.$app.Handle(Index).by(observer).by(window.$app.memo).get()
