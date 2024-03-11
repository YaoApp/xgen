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
import LoginWrapper from './wrappers/Login'

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
	const { pathname } = useLocation()
	const menu = toJS(global.menu)
	const is_login = pathname.indexOf('/login/') !== -1 || pathname === '/'

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

		global.stack.reset()
	}, [pathname])

	const menu_items = useMemo(() => menu[global.current_nav]?.children || [], [menu, global.current_nav])

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
		visible_menu: global.visible_menu
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
		visible: global.visible_menu
	}

	const props_neo: IPropsNeo = {
		stack: global.stack.paths.join('/'),
		api: global.app_info.optional?.neo?.api!,
		studio: global.app_info.optional?.neo?.studio
	}

	const props_container: IPropsContainer = {
		menu: menu_items,
		visible_menu: global.visible_menu,
		menu_layout: global.app_info.optional?.menu?.layout || '2-columns'
	}

	return (
		<HelmetProvider>
			<Helmet {...props_helmet}></Helmet>
			<ConfigProvider prefixCls='xgen'>
				<GlobalContext.Provider value={global}>
					{is_login ? (
						<LoginWrapper {...props_Login_wrapper}>
							<Outlet />
						</LoginWrapper>
					) : (
						<Fragment>
							<Loading {...props_loading}></Loading>
							<If
								condition={
									!global.app_info.optional ||
									!global.app_info.optional.menu ||
									global.app_info.optional?.menu?.layout === '2-columns'
								}
							>
								<Then>
									<Nav {...props_nav}></Nav>
									<Menu {...props_menu} nav_props={props_nav}></Menu>
									<Container {...props_container}>
										<Outlet />
									</Container>
								</Then>
							</If>
							<If condition={global.app_info.optional?.menu?.layout === '1-column'}>
								<Then>
									<MenuColumnOne
										{...props_menu}
										nav_props={props_nav}
									></MenuColumnOne>
									<ContainerColumnOne {...props_container}>
										<Outlet />
									</ContainerColumnOne>
								</Then>
							</If>
							{global.app_info.optional?.neo?.api && <Neo {...props_neo}></Neo>}
						</Fragment>
					)}
				</GlobalContext.Provider>
			</ConfigProvider>
		</HelmetProvider>
	)
}

export default new window.$app.Handle(Index).by(observer).get()
