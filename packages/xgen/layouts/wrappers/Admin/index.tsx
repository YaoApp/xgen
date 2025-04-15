import { Fragment, FC, PropsWithChildren } from 'react'
import { observer } from 'mobx-react-lite'
import { If, Then } from 'react-if'
import { container } from 'tsyringe'
import { GlobalModel } from '@/context/app'

import Loading from '../../components/Loading'
import Container from '../../components/Container'
import Nav from '../../components/Nav'
import Menu from '../../components/Menu'
import Neo from '../../../neo'
import NeoSidebar from '../../../neo/components/Sidebar'
import ContainerColumnOne from '../../components/ColumnOne/Container'
import MenuColumnOne from '../../components/ColumnOne/Menu'

import type { IPropsLoading, IPropsNav, IPropsMenu, IPropsNeo, IPropsContainer } from '../../types'

const AdminWrapper: FC<PropsWithChildren> = ({ children }) => {
	const global = container.resolve(GlobalModel)
	const menu_items = global.menu[global.current_nav]?.children || []
	const layout = global.app_info.optional?.menu?.layout || '2-columns'
	const show_name = global.app_info.optional?.menu?.showName || false
	const is_chat = location.pathname?.startsWith('/chat')

	const props_loading: IPropsLoading = {
		loading: global.loading,
		menu: menu_items,
		visible_menu: global.visible_menu,
		show_name: show_name
	}

	const props_nav: IPropsNav = {
		avatar: global.avatar,
		app_info: global.app_info,
		user: global.user,
		menus: global.menus,
		current_nav: global.current_nav,
		in_setting: global.in_setting,
		setAvatar: global.setAvatar,
		setInSetting: (v) => (global.in_setting = v)
	}

	const props_menu: IPropsMenu = {
		locale_messages: global.locale_messages,
		parent: global.menu[global.current_nav],
		items: menu_items,
		menu_key_path: global.menu_key_path,
		menu_selected_keys: global.menu_selected_keys,
		visible: global.visible_menu,
		show_name: show_name
	}

	const props_neo: IPropsNeo = {
		stack: global.stack.paths.join('/'),
		api: global.app_info.optional?.neo?.api!,
		studio: global.app_info.optional?.neo?.studio,
		dock: global.app_info.optional?.neo?.dock || 'right-bottom'
	}

	const props_container: IPropsContainer = {
		menu: menu_items,
		visible_menu: global.visible_menu,
		menu_layout: layout,
		show_name: show_name,
		hide_nav: global.hide_nav,
		sidebar_content: !is_chat && <NeoSidebar {...props_neo}></NeoSidebar>,
		sidebar_visible: !is_chat && props_neo.dock === 'right',
		sidebar_hidden: is_chat
	}

	return (
		<Fragment>
			<If condition={global.hide_nav}>
				<Then>
					<Loading {...props_loading}></Loading>
					<Container {...props_container}>{children}</Container>
				</Then>
			</If>
			<If condition={!global.hide_nav && layout === '2-columns'}>
				<Then>
					<Loading {...props_loading}></Loading>
					<Nav {...props_nav}></Nav>
					<Menu {...props_menu}></Menu>
					<Container {...props_container}>{children}</Container>
				</Then>
			</If>

			<If condition={!global.hide_nav && layout === '1-column'}>
				<Then>
					<Loading {...props_loading}></Loading>
					<MenuColumnOne {...props_menu} nav_props={props_nav}></MenuColumnOne>
					<ContainerColumnOne {...props_container}>{children}</ContainerColumnOne>
				</Then>
			</If>

			<If condition={layout !== '1-column' && layout !== '2-columns'}>
				<Then>
					<div className='text_center mt_20'>
						<strong>layout = {layout}</strong>
						<p>
							app.yao <strong>menu.optional.menu.layout</strong> , shoule be{' '}
							<strong>1-column</strong> or
							<strong>2-columns</strong>. Please check the configuration.
						</p>
					</div>
				</Then>
			</If>

			<Neo {...props_neo}></Neo>
		</Fragment>
	)
}

export default observer(AdminWrapper)
