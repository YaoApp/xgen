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
import axios from 'axios'
import { Icon } from '@/widgets'

const Custom = window.$app.memo((props: ICustom) => {
	const { __name, value: __value, xProps, ...rest_props } = props
	const [value, setValue] = useState<SelectProps['value']>()
	const is_cn = getLocale() === 'zh-CN'
	const [options, setOptions] = useState<SelectProps['options']>(props.options || [])

	const parseOptions = (options?: any[]): SelectProps['options'] => {
		const opts: SelectProps['options'] = []
		if (options) {
			for (const item of options) {
				let label = item.label
				if (item.icon) {
					const size = item.icon.size || 16
					const name = item.icon.name || item.icon
					label = (
						<div style={{ display: 'flex', alignItems: 'center' }}>
							<Icon name={name} size={size} className='mr_4' />
							<span>{item.label}</span>
						</div>
					)
				}

				opts.push({
					label: label,
					value: item.value
				})
			}
		}
		return opts
	}

	useEffect(() => {
		if (__value === undefined || __value === null) return
		setValue(__value)
	}, [props.mode, __value])

	useEffect(() => {
		setOptions(parseOptions(props.options))
	}, [props.options])

	const onChange: SelectProps['onChange'] = (v) => {
		if (!props.onChange) return

		// @ts-ignore
		props.onChange(v)

		setValue(v)
	}

	const fetchRemoteOptions = (selected?: any, keywords?: string) => {
		if (xProps?.remote) {
			const api = xProps.remote.api
			const params: Record<string, any> = { ...xProps.remote.params }
			if (keywords && keywords != '') {
				params['keywords'] = keywords.trim()
			}

			if (selected) {
				params['selected'] = selected
			}

			axios.get<any, SelectProps['options']>(api, { params })
				.then((res) => {
					setOptions(parseOptions(res))
				})
				.catch((err) => {
					console.error('[Select] remote search error', err)
				})
		}
	}

	const onClear = () => {
		setValue(null)
		fetchRemoteOptions()
	}

	const onFocus = () => {
		fetchRemoteOptions(value) // Reset the options when focus
	}

	// Merge the remote api for search
	// props.search will be deprecated in the future
	const defaultOnSearch: SelectProps['onSearch'] = (v) => {
		const selected = value ? (Array.isArray(value) ? value : [value]) : []
		fetchRemoteOptions(selected, v)
	}

	if (rest_props.showSearch) {
		rest_props.onSearch = rest_props.onSearch ? rest_props.onSearch : defaultOnSearch
	}

	return (
		<Select
			className={clsx([styles._local, props.mode === 'multiple' && styles.multiple])}
			popupClassName={styles._dropdown}
			placeholder={`${is_cn ? '请选择' : 'Please select '}${__name}`}
			getPopupContainer={(node) => node.parentNode}
			value={value}
			onFocus={onFocus}
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
