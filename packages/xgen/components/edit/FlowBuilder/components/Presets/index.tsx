import { Icon } from '@/widgets'
import { CreateID, IconName, IconSize } from '../../utils'
import { useBuilderContext } from '../Builder/Provider'
import { useState } from 'react'
import { RadioChangeEvent, Segmented } from 'antd'

import styles from './index.less'
import clsx from 'clsx'

interface IProps {
	keywords?: string
}

const Index = (props: IProps) => {
	const { is_cn, setting } = useBuilderContext()
	const [kind, setKind] = useState<string>('all')
	const options = [
		{ label: is_cn ? '全部' : 'ALL', value: 'all' },
		{ label: is_cn ? '流程' : 'Flows', value: 'flow' },
		{ label: is_cn ? '节点' : 'Nodes', value: 'nodes' }
	]

	const onChange = (e: RadioChangeEvent) => {
		setKind(e.target.value)
	}

	return (
		<div className={clsx([styles._local])}>
			<div className='categories'>
				<Segmented
					options={options}
					value={kind}
					onChange={(value) => {
						setKind(value.toString())
					}}
				/>
			</div>
			<div className='items mt_16 pl_8 pr_8'>
				{[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((item, index) => (
					<div
						key={index}
						className='item'
						draggable
						unselectable='on'
						onDragStart={(e) => e.dataTransfer.setData('application/reactflow', 'AI-Data')}
					>
						Preset Item
					</div>
				))}
			</div>
		</div>
	)
}

export default window.$app.memo(Index)
