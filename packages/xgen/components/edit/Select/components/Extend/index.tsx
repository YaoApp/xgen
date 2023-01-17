import { useReactive } from 'ahooks'
import { Button, Input, message } from 'antd'
import clsx from 'clsx'

import { CheckOutlined } from '@ant-design/icons'

import styles from './index.less'

import type { IPropsExtend } from '../../types'

const Index = (props: IPropsExtend) => {
	const { addOptionItem } = props
	const x = useReactive({ label: '', value: '' })

	const add = () => {
		if (!x.label || x.value === '') return message.warning('label，value不可为空')

		addOptionItem(x.label, x.value)

		x.label = ''
		x.value = ''
	}

	return (
		<div className={clsx([styles._local, 'w_100 flex justify_between align_center'])}>
			<Input
				className='input_extend'
				placeholder='label'
				value={x.label}
				onChange={(e) => (x.label = e.target.value)}
			></Input>
			<Input
				className='input_extend'
				placeholder='value'
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
