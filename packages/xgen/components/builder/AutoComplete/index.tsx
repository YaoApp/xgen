import { AutoComplete } from 'antd'
import clsx from 'clsx'
import { observer } from 'mobx-react-lite'
import { useEffect, useLayoutEffect, useState } from 'react'
import { container } from 'tsyringe'

import Item from '../Item'
import { getLocale } from '@umijs/max'

import styles from './index.less'
import Model from './model'

import type { IProps, ICustom } from './types'
import type { AutoCompleteProps } from 'antd'
import axios from 'axios'

const Custom = window.$app.memo((props: ICustom) => {
	const { __name, value: __value, xProps, onSearch, ...rest_props } = props
	const [value, setValue] = useState<AutoCompleteProps['value']>()
	const [options, setOptions] = useState<AutoCompleteProps['options']>(props.options || [])
	const is_cn = getLocale() === 'zh-CN'

	useEffect(() => {
		if (__value === undefined || __value === null) {
			setValue(props.defaultValue || null)
			return
		}

		setValue(__value)
	}, [props.mode, __value])

	useEffect(() => {
		if (!props.options) return
		setOptions(props.options || [])
	}, [props.options])

	const onChange: AutoCompleteProps['onChange'] = (v) => {
		// Trigger remote search
		if (xProps?.remote) {
			const api = xProps.remote.api
			const params = { ...xProps.remote.params, ['keywords']: v }
			axios.get<any, AutoCompleteProps['options']>(api, { params })
				.then((res) => {
					setOptions(res)
				})
				.catch((err) => {
					console.error('[AutoComplete] remote search error', err)
				})
		}

		if (!props.onChange) return

		// @ts-ignore
		props.onChange(v)

		setValue(v)
	}

	return (
		<AutoComplete
			className={clsx([
				styles._local,
				props.mode === 'multiple' && styles.multiple,
				props.__type === 'view' && styles.view
			])}
			popupClassName={styles._dropdown}
			placeholder={`${is_cn ? '请输入' : 'Please input '}${__name}`}
			getPopupContainer={(node) => node.parentNode}
			value={value}
			{...rest_props}
			options={options}
			onChange={onChange}
			showSearch={true}
		></AutoComplete>
	)
})

const Index = (props: IProps) => {
	const {
		__bind,
		__name,
		__type,
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

	return (
		<Item {...itemProps} {...{ __bind, __name, __type }}>
			<Custom
				{...rest_props}
				{...x.target_props}
				__name={__name}
				__type={__type}
				options={x.options}
			></Custom>
		</Item>
	)
}

export default new window.$app.Handle(Index).by(observer).by(window.$app.memo).get()
