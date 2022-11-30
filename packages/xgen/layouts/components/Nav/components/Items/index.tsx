import { Tooltip } from 'antd'
import clsx from 'clsx'

import { Icon } from '@/widgets'
import { Link } from '@umijs/max'

import styles from './index.less'

import type { IPropsItems } from '@/layouts/types'

const Index = (props: IPropsItems) => {
	const { items, current_nav, in_setting, setCurrentNav, setInSetting } = props

	return (
		<div className={clsx([styles._local, 'nav_items w_100 border_box flex flex_column align_center'])}>
			{items.map((item, index) => (
				<Tooltip title={item.name} placement='right' key={index}>
					<Link
						className={clsx([
							'nav_item w_100 flex justify_center align_center clickable',
							current_nav === index && !in_setting ? 'active' : ''
						])}
						to={item.path}
						onClick={() => {
							setCurrentNav(index)
							setInSetting(false)
						}}
					>
						<Icon name={item.icon} size={20}></Icon>
					</Link>
				</Tooltip>
			))}
		</div>
	)
}

export default window.$app.memo(Index)
