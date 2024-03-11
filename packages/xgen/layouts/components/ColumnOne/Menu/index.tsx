import { useDeepCompareEffect } from 'ahooks'
import { Input, Menu } from 'antd'
import clsx from 'clsx'
import { useState } from 'react'

import { Icon } from '@/widgets'
import { history, Link } from '@umijs/max'

import { useMenuItems, useSearch } from './hooks'
import styles from './index.less'

import type { IPropsLogo, IPropsMenu } from '../../../types'
import type { MenuProps } from 'antd'
import Logo from './Logo'
import { Utils } from './utils'

const Index = (props: IPropsMenu) => {
	const { locale_messages, parent, items, menu_selected_keys, visible, nav_props } = props
	const { visible_input, current_items, toggle, setInput } = useSearch(items)
	// const { menu_items } = useMenuItems(current_items)
	const [openKeys, setOpenKeys] = useState<Array<string>>([])

	useDeepCompareEffect(() => {
		setOpenKeys(menu_selected_keys)
	}, [menu_selected_keys])

	const props_logo: IPropsLogo = {
		logo: nav_props?.app_info?.logo
	}

	// Application menu items
	const { menu_items } = useMenuItems(nav_props?.menus?.items || [])
	const props_menu: MenuProps = {
		items: menu_items,
		mode: 'inline',
		inlineIndent: 20,
		forceSubMenuRender: true,
		selectedKeys: menu_selected_keys,
		openKeys,
		onOpenChange(openKeys) {
			setOpenKeys(openKeys)
		},
		onSelect({ key }) {
			history.push(key)
		}
	}

	// Setting menu items
	const { menu_items: setting_items } = useMenuItems(nav_props?.menus?.setting || [])
	const props_setting: MenuProps = {
		items: setting_items,
		mode: 'vertical',
		inlineIndent: 20,
		forceSubMenuRender: true,
		selectedKeys: menu_selected_keys,
		openKeys,
		onOpenChange(openKeys) {
			setOpenKeys(openKeys)
		},
		onSelect({ key }) {
			history.push(key)
		}
	}

	return (
		<div className={clsx([styles._local, (!items?.length || !visible) && styles.hidden])}>
			<div>
				<Link
					to={'/setting'}
					className='title_wrap w_100 border_box flex flex_column justify_between align_center relative'
				>
					<Logo {...props_logo}></Logo>
					<div className='title'> {nav_props?.app_info?.name} </div>
					<div className='sub_title'>{nav_props?.user?.mobile || nav_props?.user?.email}</div>
				</Link>

				<div className='menu_wrap w_100'>
					<Menu {...props_menu}></Menu>
				</div>
			</div>

			<div className='setting_wrap w_100'>
				<Menu {...props_setting}></Menu>
			</div>
		</div>
	)
}

export default window.$app.memo(Index)
