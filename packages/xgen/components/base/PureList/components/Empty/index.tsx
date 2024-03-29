import { Button, Empty } from 'antd'
import { PlusCircle } from 'phosphor-react'

import styles from './index.lsss'

import type { IPropsEmpty } from '../../types'

const Index = (props: IPropsEmpty) => {
	const { onAdd } = props

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
				添加数据项
			</Button>
		</div>
	)
}

export default window.$app.memo(Index)
