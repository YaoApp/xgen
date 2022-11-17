import { Button, Empty } from 'antd'
import clsx from 'clsx'
import { PlusCircle } from 'phosphor-react'

import styles from './index.less'

import type { IPropsEmpty } from '../../types'

const Index = (props: IPropsEmpty) => {
	const { onAdd } = props

	return (
		<div className={clsx([styles._local, 'w_100 flex flex_column align_center justify_center'])}>
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
