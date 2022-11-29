import clsx from 'clsx'

import Items from './components/Items'
import Logo from './components/Logo'
import Options from './components/Options'
import styles from './index.less'

import type { IPropsNav, IPropsLogo, IPropsItems, IPropsOptions } from '../../types'

const Index = (props: IPropsNav) => {
	const { avatar, app_info, user, menu, visible_nav, current_nav, in_setting, setAvatar, setInSetting } = props

	const props_logo: IPropsLogo = {
		logo: app_info?.logo
	}

	const props_items: IPropsItems = {
		menu,
		current_nav,
		in_setting,
		setInSetting
	}

	const props_options: IPropsOptions = {
		avatar,
		app_info,
		user,
		in_setting,
		setAvatar,
		setInSetting
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
