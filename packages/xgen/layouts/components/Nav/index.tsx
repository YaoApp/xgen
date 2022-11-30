import Items from './components/Items'
import Logo from './components/Logo'
import Options from './components/Options'
import styles from './index.less'

import type { IPropsNav, IPropsLogo, IPropsItems, IPropsOptions } from '../../types'

const Index = (props: IPropsNav) => {
	const { avatar, app_info, user, menus, current_nav, in_setting, setAvatar, setCurrentNav, setInSetting } = props

	const props_logo: IPropsLogo = {
		logo: app_info?.logo
	}

	const props_items: IPropsItems = {
		items: menus.items,
		current_nav,
		in_setting,
		setCurrentNav,
		setInSetting
	}

	const props_options: IPropsOptions = {
		items: menus.setting,
		current_nav,
		in_setting,
		avatar,
		app_info,
		user,
		setAvatar,
		setCurrentNav,
		setInSetting
	}

	return (
		<div id='nav_wrap' className={styles._local}>
			<div className='flex flex_column'>
				<Logo {...props_logo}></Logo>
				<Items {...props_items}></Items>
			</div>
			<Options {...props_options}></Options>
		</div>
	)
}

export default window.$app.memo(Index)
