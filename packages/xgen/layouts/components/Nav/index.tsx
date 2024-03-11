import Items from './components/Items'
import Logo from './components/Logo'
import Options from './components/Options'
import styles from './index.less'

import type { IPropsNav, IPropsLogo, IPropsItems, IPropsOptions } from '../../types'
import { Tooltip } from 'antd'
import { Link } from '@umijs/max'

const Index = (props: IPropsNav) => {
	const { avatar, app_info, user, menus, current_nav, in_setting, setAvatar, setInSetting } = props

	const props_logo: IPropsLogo = {
		logo: app_info?.logo
	}

	const show_name = app_info.optional?.menu?.showName
	const props_items: IPropsItems = {
		items: menus.items,
		current_nav,
		in_setting,
		show_name: show_name,
		setInSetting
	}

	const props_options: IPropsOptions = {
		items: menus.setting,
		current_nav,
		in_setting,
		avatar,
		app_info,
		show_name: show_name,
		user,
		setAvatar,
		setInSetting
	}

	return (
		<div id='nav_wrap' className={show_name ? styles._local_showname : styles._local}>
			<div className='flex flex_column'>
				<Tooltip title={app_info.name} placement='right'>
					<Link to={'/setting'}>
						<Logo {...props_logo}></Logo>
					</Link>
				</Tooltip>
				<Items {...props_items}></Items>
			</div>
			<Options {...props_options}></Options>
		</div>
	)
}

export default window.$app.memo(Index)
