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
	show_name?: boolean
	onClick: () => void
}

const Index = (props: IPropsNavItem) => {
	const { item, active, show_name, onClick } = props
	const icon = typeof item.icon === 'string' ? { name: item.icon, size: 20 } : item.icon
	return (
		<>
			<If condition={show_name === true}>
				<Then>
					<Link
						to={item.key}
						onClick={onClick}
						className={clsx([
							styles._local_showname,
							active && styles.active,
							'w_100 flex flex_column justify_center clickable'
						])}
					>
						<div className='w_100 flex justify_center align_center'>
							<If condition={item.badge || item.dot}>
								<Then>
									<Badge count={item.badge} dot={item.dot}>
										{icon && <Icon name={icon?.name} size={icon.size}></Icon>}
									</Badge>
								</Then>
								<Else>{icon && <Icon name={icon?.name} size={icon.size}></Icon>}</Else>
							</If>
						</div>
						<div className='name'>{item.name}</div>
					</Link>
				</Then>
			</If>
			<If condition={show_name == undefined || show_name === false}>
				<Then>
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
										{icon && <Icon name={icon?.name} size={icon.size}></Icon>}
									</Badge>
								</Then>
								<Else>{icon && <Icon name={icon?.name} size={icon.size}></Icon>}</Else>
							</If>
						</Link>
					</Tooltip>
				</Then>
			</If>
		</>
	)
}

export default window.$app.memo(Index)
