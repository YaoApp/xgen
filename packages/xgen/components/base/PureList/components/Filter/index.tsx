import { Button, Input } from 'antd'
import clsx from 'clsx'
import { MagnifyingGlass, Plus } from 'phosphor-react'

import styles from './index.less'

import type { IPropsFilter } from '../../types'

const Index = (props: IPropsFilter) => {
	const { onAdd } = props

	return (
		<div className={clsx([styles._local, 'w_100 flex justify_between align_center'])}>
			<Input
				className='input_search_list'
				placeholder='在列表中搜索'
				prefix={<MagnifyingGlass size={15}></MagnifyingGlass>}
			></Input>
			<Button className='btn_add flex justify_center align_center' type='primary' onClick={() => onAdd([])}>
				<Plus size={18} weight='bold'></Plus>
			</Button>
		</div>
	)
}

export default window.$app.memo(Index)
