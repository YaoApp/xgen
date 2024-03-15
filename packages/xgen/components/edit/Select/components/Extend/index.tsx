import { useReactive } from 'ahooks'
import { Button, Input, message } from 'antd'
import clsx from 'clsx'

import { CheckOutlined } from '@ant-design/icons'

import styles from './index.less'

import type { IPropsExtend } from '../../types'
import { getLocale } from '@umijs/max'

const Index = (props: IPropsExtend) => {
	const { addOptionItem, valueOnly, valuePlaceholder, labelPlaceholder } = props
	const x = useReactive({ label: '', value: '' })

	const add = () => {
		if (!valueOnly && (!x.label || x.value === '')) return message.warning('label，value不可为空')
		if (valueOnly && x.value === '') return message.warning('value不可为空')

		// ValueOnly mode label = value
		if (valueOnly) {
			x.label = x.value
		}

		addOptionItem(x.label, x.value)
		x.label = ''
		x.value = ''
	}

	const is_cn = getLocale() === 'zh-CN'
	const placeholderValue = valuePlaceholder ? valuePlaceholder : is_cn ? '添加选项' : 'Add Option'
	const placeholderLabel = labelPlaceholder ? labelPlaceholder : is_cn ? '添加选项名称' : 'Add Option Name'
	const className = valueOnly ? 'value_extend' : 'input_extend'

	return (
		<div className={clsx([styles._local, 'w_100 flex justify_between align_center'])}>
			{!valueOnly && (
				<Input
					className='input_extend'
					placeholder={placeholderLabel}
					value={x.label}
					onChange={(e) => (x.label = e.target.value)}
				></Input>
			)}

			<Input
				className={className}
				placeholder={placeholderValue}
				value={x.value}
				onChange={(e) => (x.value = e.target.value)}
			></Input>
			<Button
				className='btn_extend'
				type='primary'
				icon={<CheckOutlined size={15}></CheckOutlined>}
				onClick={add}
			></Button>
		</div>
	)
}

export default window.$app.memo(Index)
