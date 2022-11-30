import { useMemoizedFn } from 'ahooks'
import clsx from 'clsx'

import NavItem from '../NavItem'
import styles from './index.less'

import type { IPropsItems } from '@/layouts/types'

const Index = (props: IPropsItems) => {
	const { items, current_nav, in_setting, setCurrentNav, setInSetting } = props

	const onClick = useMemoizedFn((index) => {
		setCurrentNav(index)
		setInSetting(false)
	})

	return (
		<div className={clsx([styles._local, 'nav_items w_100 border_box flex flex_column align_center'])}>
			{items.map((item, index) => (
				<NavItem
					item={item}
					active={!in_setting && current_nav === index}
					index={index}
					onClick={onClick}
					key={index}
				></NavItem>
			))}
		</div>
	)
}

export default window.$app.memo(Index)
