import { Button, Empty } from 'antd'
import { PlusCircle } from 'phosphor-react'

import styles from './index.lsss'

import type { IPropsEmpty } from '../../types'
import { getLocale } from '@umijs/max'

const Index = (props: IPropsEmpty) => {
	const { builder, onAdd } = props

	const is_cn = getLocale() === 'zh-CN'

	if (builder)
		return (
			<div
				className='empty_wrap w_100 flex flex_column align_center justify_center'
				style={{ paddingTop: 6, paddingBottom: 6 }}
			>
				<Button
					className='flex justify_center align_center'
					type='primary'
					icon={<PlusCircle className='mr_6' size={14}></PlusCircle>}
					onClick={() => onAdd([])}
				>
					{props.placeholder || (is_cn ? '添加' : 'Add')}
				</Button>
			</div>
		)

	return (
		<div className='empty_wrap w_100 flex flex_column align_center justify_center'>
			<style>{styles}</style>
			<Empty className='empty' image={Empty.PRESENTED_IMAGE_SIMPLE} />
			<Button
				className='flex justify_center align_center'
				type='primary'
				icon={<PlusCircle className='mr_6' size={18}></PlusCircle>}
				onClick={() => onAdd([])}
			>
				{props.placeholder || (is_cn ? '添加' : 'Add')}
			</Button>
		</div>
	)
}

export default window.$app.memo(Index)
