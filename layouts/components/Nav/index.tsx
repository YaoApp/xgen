import clsx from 'clsx'

import Items from './components/Items'
import Logo from './components/Logo'
import Options from './components/Options'
import styles from './index.less'

import type { IPropsNav, IPropsItems, IPropsOptions } from '../../types'

const Index = (props: IPropsNav) => {
	const {
		theme,
		avatar,
		app_info,
		user,
		menu,
		visible_nav,
		current_nav,
		setTheme,
		setCurrentNav,
		getUserMenu
	} = props

	const props_items: IPropsItems = {
		menu,
		current_nav,
		setCurrentNav
	}

	const props_options: IPropsOptions = {
		theme,
		avatar,
		app_info,
		user,
		setTheme,
		getUserMenu
	}

	return (
		<div className={clsx([styles._local, !visible_nav ? styles.invisible : ''])}>
			<div className='flex flex_column'>
				<Logo></Logo>
				<Items {...props_items}></Items>
			</div>
			<Options {...props_options}></Options>
		</div>
	)
}

export default window.$app.memo(Index)
