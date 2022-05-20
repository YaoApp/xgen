import clsx from 'clsx'

import Items from './components/Items'
import Logo from './components/Logo'
import Options from './components/Options'
import styles from './index.less'

import type { IPropsNav, IPropsLogo, IPropsItems, IPropsOptions } from '../../types'

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
		setAvatar,
		getUserMenu
	} = props

	const props_logo: IPropsLogo = {
		logo: app_info.icons
	}

	const props_items: IPropsItems = {
		menu,
		current_nav,
	}

	const props_options: IPropsOptions = {
		theme,
		avatar,
		app_info,
		user,
		setTheme,
		setAvatar,
		getUserMenu
	}

	return (
		<div className={clsx([styles._local, !visible_nav ? styles.invisible : ''])}>
			<div className='flex flex_column'>
				<Logo {...props_logo}></Logo>
				<Items {...props_items}></Items>
			</div>
			<Options {...props_options}></Options>
		</div>
	)
}

export default window.$app.memo(Index)
