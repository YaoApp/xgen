import '@/styles/index.less'

import { useMemoizedFn } from 'ahooks'
import { ConfigProvider } from 'antd'
import { toJS } from 'mobx'
import { observer } from 'mobx-react-lite'
import { Fragment, useLayoutEffect, useMemo, useState } from 'react'
import { HelmetProvider } from 'react-helmet-async'
import { container } from 'tsyringe'
import { If, Then } from 'react-if'

import { GlobalContext, GlobalModel } from '@/context/app'
import { useIntl } from '@/hooks'
import { Outlet, useLocation } from '@umijs/max'

import ContainerColumnOne from './components/ColumnOne/Container'
import MenuColumnOne from './components/ColumnOne/Menu'

import Container from './components/Container'
import Helmet from './components/Helmet'
import Loading from './components/Loading'
import Menu from './components/Menu'
import Nav from './components/Nav'
import Neo from './components/Neo'
import NeoSidebar from './components/Neo/Sidebar'
import LoginWrapper from './wrappers/Login'
import AuthWrapper from './wrappers/Auth'

import type {
	IPropsHelmet,
	IPropsLoginWrapper,
	IPropsLoading,
	IPropsNav,
	IPropsMenu,
	IPropsNeo,
	IPropsContainer
} from './types'

const Index = () => {
	const messages = useIntl()
	const [global] = useState(() => container.resolve(GlobalModel))
	const { pathname, search } = useLocation()
	const [hide_nav, setHideNav] = useState(false)
	const menu = toJS(global.menu)
	const is_login = pathname.indexOf('/login/') !== -1 || pathname === '/'
	const is_auth = pathname === '/auth'
	const is_chat = pathname?.startsWith('/chat')

	useLayoutEffect(() => {
		window.$global = global

		global.locale_messages = messages
		global.on()
		global.stack.on()

		return () => {
			global.off()
			global.stack.off()
		}
	}, [])

	useLayoutEffect(() => {
		global.visible_menu = true
		global.hide_nav = search.indexOf('__hidemenu=1') !== -1
		setHideNav(global.hide_nav)
		global.stack.reset()
	}, [pathname])

	const menu_items = useMemo(() => menu[global.current_nav]?.children || [], [menu, global.current_nav])
	const layout = global.app_info.optional?.menu?.layout || '2-columns'
	const show_name = global.app_info.optional?.menu?.showName || false
	const props_helmet: IPropsHelmet = {
		theme: global.theme,
		app_info: global.app_info
	}

	const props_Login_wrapper: IPropsLoginWrapper = {
		logo: global.app_info?.logo,
		admin: global.app_info?.login?.admin,
		user: global.app_info?.login?.user
	}

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
		menus: toJS(global.menus),
		current_nav: global.current_nav,
		in_setting: global.in_setting,
		setAvatar: useMemoizedFn(global.setAvatar),
		setInSetting: useMemoizedFn((v) => (global.in_setting = v))
	}

	const props_menu: IPropsMenu = {
		locale_messages: messages,
		parent: menu[global.current_nav],
		items: menu_items,
		menu_key_path: toJS(global.menu_key_path),
		menu_selected_keys: toJS(global.menu_selected_keys),
		visible: global.visible_menu,
		show_name: show_name
	}

	// Neo Settings
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
		hide_nav: hide_nav,
		sidebar_content: !is_chat && <NeoSidebar {...props_neo}></NeoSidebar>,
		sidebar_visible: !is_chat && props_neo.dock === 'right',
		sidebar_hidden: is_chat
	}

	return (
		<HelmetProvider>
			<Helmet {...props_helmet}></Helmet>
			<ConfigProvider prefixCls='xgen'>
				<GlobalContext.Provider value={global}>
					<If condition={is_login}>
						<Then>
							<LoginWrapper {...props_Login_wrapper}>
								<Outlet />
							</LoginWrapper>
						</Then>
					</If>

					<If condition={is_auth}>
						<Then>
							<AuthWrapper {...props_Login_wrapper}>
								<Outlet />
							</AuthWrapper>
						</Then>
					</If>

					<If condition={!is_auth && !is_login}>
						<Then>
							<Fragment>
								<If condition={hide_nav}>
									<Then>
										<Loading {...props_loading}></Loading>
										<Container {...props_container}>
											<Outlet />
										</Container>
									</Then>
								</If>
								<If condition={!hide_nav && layout === '2-columns'}>
									<Then>
										<Loading {...props_loading}></Loading>
										<Nav {...props_nav}></Nav>
										<Menu {...props_menu}></Menu>
										<Container {...props_container}>
											<Outlet />
										</Container>
									</Then>
								</If>

								<If condition={!hide_nav && layout === '1-column'}>
									<Then>
										<Loading {...props_loading}></Loading>
										<MenuColumnOne
											{...props_menu}
											nav_props={props_nav}
										></MenuColumnOne>
										<ContainerColumnOne {...props_container}>
											<Outlet />
										</ContainerColumnOne>
									</Then>
								</If>

								<If condition={layout !== '1-column' && layout !== '2-columns'}>
									<Then>
										<div className='text_center mt_20'>
											<strong>layout = {layout}</strong>
											<p>
												app.yao{' '}
												<strong>menu.optional.menu.layout</strong> ,
												shoule be <strong>1-column</strong> or
												<strong>2-columns</strong>. Please check the
												configuration.
											</p>
										</div>
									</Then>
								</If>

								<Neo {...props_neo}></Neo>
							</Fragment>
						</Then>
					</If>
				</GlobalContext.Provider>
			</ConfigProvider>
		</HelmetProvider>
	)
}

export default new window.$app.Handle(Index).by(observer).get()
