import { useMemoizedFn, useSize } from 'ahooks'
import clsx from 'clsx'
import { useMemo } from 'react'
import { When } from 'react-if'

import NavItem from '../NavItem'
import styles from './index.less'

import type { IPropsItems } from '@/layouts/types'

const Index = (props: IPropsItems) => {
	const { items, current_nav, in_setting, show_name, setInSetting } = props
	const size_nav_wrap = useSize(() => document.getElementById('nav_wrap'))
	const size_menu_items_wrap = useSize(() => document.getElementById('menu_items_wrap'))
	const size_setting_items_wrap = useSize(() => document.getElementById('setting_items_wrap'))

	const overflow = useMemo(() => {
		if (!size_nav_wrap?.height || !size_menu_items_wrap?.height || !size_setting_items_wrap?.height) {
			return false
		}

		if (size_menu_items_wrap?.height + size_setting_items_wrap?.height + 60 > size_nav_wrap?.height) {
			return true
		}

		return false
	}, [size_nav_wrap, size_menu_items_wrap, size_setting_items_wrap])

	const height = useMemo(() => {
		if (!size_setting_items_wrap?.height) return 'auto'

		return `calc(100vh - 60px - ${size_setting_items_wrap.height}px)`
	}, [size_setting_items_wrap])

	const onClick = useMemoizedFn(() => setInSetting(false))

	return (
		<div className={clsx([styles._local, 'w_100'])} style={{ height }}>
			<When condition={overflow}>
				<div className='top_mask w_100 mask absolute'></div>
				<div
					className='bottom_mask w_100 mask absolute'
					style={{ bottom: size_setting_items_wrap?.height }}
				></div>
			</When>
			<div id='menu_items_wrap' className='nav_items w_100 border_box flex flex_column'>
				{items?.map((item, index) => (
					<NavItem
						item={item}
						active={!in_setting && current_nav === index}
						onClick={onClick}
						show_name={show_name}
						key={index}
					></NavItem>
				))}
			</div>
		</div>
	)
}

export default window.$app.memo(Index)
