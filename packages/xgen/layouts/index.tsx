import { useMemoizedFn } from 'ahooks'
import { ConfigProvider } from 'antd'
import { observer } from 'mobx-react-lite'
import { Fragment, useLayoutEffect, useState } from 'react'
import { HelmetProvider } from 'react-helmet-async'
import { container } from 'tsyringe'

import { GlobalContext, GlobalModel } from '@/context/app'
import { Outlet, useIntl, useLocation } from '@umijs/max'

import Container from './components/Container'
import Helmet from './components/Helmet'
import Loading from './components/Loading'
import Menu from './components/Menu'
import Nav from './components/Nav'
import LoginWrapper from './wrappers/Login'

import type {
	IPropsHelmet,
	IPropsLoginWrapper,
	IPropsLoading,
	IPropsNav,
	IPropsMenu,
	IPropsContainer
} from './types'
import type { LocaleMessages } from '@/types'

const Index = () => {
	const intl = useIntl()
	const messages: LocaleMessages = intl.messages as any
	const [global] = useState(() => container.resolve(GlobalModel))
	const menu = global.menu.slice()
	const { pathname } = useLocation()
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
		global.stack.reset()
	}, [pathname])

	const props_helmet: IPropsHelmet = {
		theme: global.theme,
		app_info: global.app_info
	}

	const props_Login_wrapper: IPropsLoginWrapper = {
		logo: global.app_info?.logo,
		layout: global.app_info.login?.layout
	}

	const props_loading: IPropsLoading = {
		loading: global.loading,
		visible_nav: global.visible_nav,
		visible_menu: global.visible_menu
	}

	const props_nav: IPropsNav = {
		theme: global.theme,
		avatar: global.avatar,
		app_info: global.app_info,
		user: global.user,
		menu: menu,
		visible_nav: global.visible_nav,
		current_nav: global.current_nav,
		setTheme: useMemoizedFn(global.setTheme),
		setAvatar: useMemoizedFn(global.setAvatar),
		getUserMenu: useMemoizedFn(global.getUserMenu)
	}

	const props_menu: IPropsMenu = {
		locale_messages: messages,
		visible: global.visible_menu,
		blocks: !!menu[global.current_nav]?.blocks,
		title: menu[global.current_nav]?.name,
		items: menu[global.current_nav]?.children || [],
		current_menu: global.current_menu
	}

	const props_container: IPropsContainer = {
		visible_nav: global.visible_nav,
		visible_menu: global.visible_menu
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
							<Nav {...props_nav}></Nav>
							<Menu {...props_menu}></Menu>
							<Container {...props_container}>
								<Outlet />
							</Container>
						</Fragment>
					)}
				</GlobalContext.Provider>
			</ConfigProvider>
		</HelmetProvider>
	)
}

export default new window.$app.Handle(Index).by(observer).by(window.$app.memo).get()
