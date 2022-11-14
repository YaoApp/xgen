import { Button, Input } from 'antd'
import clsx from 'clsx'

import { PlusOutlined, SearchOutlined } from '@ant-design/icons'

import styles from './index.less'

const Index = () => {
	return (
		<div className={clsx([styles._local, 'w_100 flex justify_between align_center'])}>
			<Input
				className='input_search_list'
				placeholder='在列表中搜索'
				prefix={<SearchOutlined></SearchOutlined>}
			></Input>
			<Button type='primary' icon={<PlusOutlined></PlusOutlined>}>添加</Button>
		</div>
	)
}

export default window.$app.memo(Index)
