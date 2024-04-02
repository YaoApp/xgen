import { Preset, Presets, Remote, Type } from '../../types'
import { useEffect, useState } from 'react'
import { GetPresets } from '../../utils'
import { Select } from 'antd'
import { getLocale } from '@umijs/max'

import styles from './index.less'
import clsx from 'clsx'
import { Icon } from '@/widgets'

interface IProps {
	data?: Remote | Presets
	onAdd?: (data: Preset) => void
}

const Index = (props: IProps) => {
	const [options, setOptions] = useState<{ label: any; value: any }[]>([])
	const [value, setValue] = useState<any>()
	const is_cn = getLocale() === 'zh-CN'

	const onClear = () => {
		setValue(null) // Reset the options
		GetPresets(props.data)
			.then((data) => updateOptions(data))
			.catch(() => {})
	}

	const onChange = (v: any) => {
		try {
			const data = JSON.parse(v)
			props.onAdd && props.onAdd(data)
		} catch (e) {
			console.error(`Failed to parse the preset data: ${v}`)
		}
		setValue(null)

		// Reset the options
		GetPresets(props.data)
			.then((data) => updateOptions(data))
			.catch(() => {})
	}

	const updateOptions = (data: Presets) => {
		const res: { label: any; value: any }[] = []
		data?.forEach((item) => {
			const text = item.props?.label || item.props?.name || item.type
			const value = JSON.stringify(item)
			const icon = item.icon || 'material-format_align_left'
			const label = (
				<div className='label'>
					<Icon name={icon} size={14} className='mr_6' />
					{text}
				</div>
			)
			res.push({ label: label, value: value })
		})
		setOptions(res)
	}

	const onSearch = (v: string) => {
		if (!props.data) return
		GetPresets(props.data, v)
			.then((data) => updateOptions(data))
			.catch(() => {})
	}

	// Get presets
	useEffect(() => {
		if (!props.data) return
		GetPresets(props.data)
			.then((data) => updateOptions(data))
			.catch(() => {})
	}, [props.data])

	return (
		<Select
			className={clsx([styles._local])}
			popupClassName={styles._dropdown}
			allowClear
			onClear={onClear}
			onChange={onChange}
			onSearch={onSearch}
			value={value}
			style={{ width: 160 }}
			filterOption={false}
			options={options}
			showSearch
			placeholder={is_cn ? '从库中选择' : 'Select from library'}
		/>
	)
}

export default window.$app.memo(Index)
