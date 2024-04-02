import { useMemoizedFn } from 'ahooks'
import { message, Select } from 'antd'
import clsx from 'clsx'
import { find } from 'lodash-es'
import { observer } from 'mobx-react-lite'
import { Fragment, useEffect, useLayoutEffect, useMemo, useState } from 'react'
import { container } from 'tsyringe'

import Item from '../Item'
import { getLocale } from '@umijs/max'

import styles from './index.less'
import Model from './model'

import type { IProps, ICustom } from './types'
import type { SelectProps } from 'antd'
import axios from 'axios'

const Custom = window.$app.memo((props: ICustom) => {
	const { __name, value: __value, xProps, ...rest_props } = props
	const [value, setValue] = useState<SelectProps['value']>()
	const is_cn = getLocale() === 'zh-CN'
	const [options, setOptions] = useState<SelectProps['options']>(props.options || [])

	useEffect(() => {
		if (__value === undefined || __value === null) return

		setValue(__value)
	}, [props.mode, __value])

	useEffect(() => {
		setOptions(props.options || [])
	}, [props.options])

	const onChange: SelectProps['onChange'] = (v) => {
		if (!props.onChange) return

		// @ts-ignore
		props.onChange(v)

		setValue(v)
	}

	// Merge the remote api for search
	// props.search will be deprecated in the future
	const defaultOnSearch: SelectProps['onSearch'] = (v) => {
		// Trigger remote search
		if (xProps?.remote) {
			const api = xProps.remote.api
			const params = { ...xProps.remote.params, ['keywords']: v }
			axios.get<any, SelectProps['options']>(api, { params })
				.then((res) => {
					setOptions(res)
				})
				.catch((err) => {
					console.error('[Select] remote search error', err)
				})
		}
	}

	if (rest_props.showSearch) {
		rest_props.onSearch = rest_props.onSearch ? rest_props.onSearch : defaultOnSearch
	}

	const onClear = () => setValue(null)
	return (
		<Select
			className={clsx([styles._local, props.mode === 'multiple' && styles.multiple])}
			popupClassName={styles._dropdown}
			placeholder={`${is_cn ? '请选择' : 'Please select '}${__name}`}
			getPopupContainer={(node) => node.parentNode}
			value={value}
			onChange={onChange}
			onClear={onClear}
			{...rest_props}
			options={options}
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

	return (
		<Item {...itemProps} {...{ __bind, __name }}>
			<Custom {...rest_props} {...x.target_props} __name={__name} options={x.options}></Custom>
		</Item>
	)
}

export default new window.$app.Handle(Index).by(observer).by(window.$app.memo).get()
