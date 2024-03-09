import { Badge, Tooltip } from 'antd'
import clsx from 'clsx'
import { Else, If, Then } from 'react-if'

import { Icon } from '@/widgets'
import { Link } from '@umijs/max'

import styles from './index.less'

import type { App } from '@/types'

export interface IPropsNavItem {
	item: App.Menu
	active: boolean
	onClick: () => void
}

const Index = (props: IPropsNavItem) => {
	const { item, active, onClick } = props
	return (
		<Tooltip title={item.name} placement='right'>
			<Link
				className={clsx([
					styles._local,
					active && styles.active,
					'w_100 flex justify_center align_center clickable'
				])}
				to={item.key}
				onClick={onClick}
			>
				<If condition={item.badge || item.dot}>
					<Then>
						<Badge count={item.badge} dot={item.dot}>
							<Icon name={item.icon} size={20}></Icon>
						</Badge>
					</Then>
					<Else>
						<Icon name={item.icon} size={20}></Icon>
					</Else>
				</If>
			</Link>
		</Tooltip>
	)
}

export default window.$app.memo(Index)
