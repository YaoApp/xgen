import '@/styles/index.less'

import { useMemoizedFn } from 'ahooks'
import { ConfigProvider } from 'antd'
import { toJS } from 'mobx'
import { observer } from 'mobx-react-lite'
import { Fragment, useLayoutEffect, useState } from 'react'
import { HelmetProvider } from 'react-helmet-async'
import store from 'store2'
import { container } from 'tsyringe'

import { GlobalContext, GlobalModel } from '@/context/app'
import { useIntl } from '@/hooks'
import { Outlet, useLocation } from '@umijs/max'

import Container from './components/Container'
import Helmet from './components/Helmet'
import Loading from './components/Loading'
import Menu from './components/Menu'
import Nav from './components/Nav'
import LoginWrapper from './wrappers/Login'

import type { IPropsHelmet, IPropsLoginWrapper, IPropsLoading, IPropsNav, IPropsMenu, IPropsContainer } from './types'

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
		global.stack.reset()
	}, [pathname])

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
		loading: global.loading
	}

	const props_nav: IPropsNav = {
		avatar: global.avatar,
		app_info: global.app_info,
		user: global.user,
		menu: toJS(global.menu_items),
		current_nav: global.current_nav,
		in_setting: global.in_setting,
		setAvatar: useMemoizedFn(global.setAvatar),
		setInSetting: useMemoizedFn((v) => (global.in_setting = v))
	}

	const props_menu: IPropsMenu = {
		locale_messages: messages,
		title: menu[global.current_nav]?.name,
		items: global.in_setting ? toJS(global.menu) : menu[global.current_nav]?.children || [],
		menu_key_path: toJS(global.menu_key_path),
		setMenuKeyPath: useMemoizedFn((v: Array<string>) => {
			global.menu_key_path = v

			store.set('menu_key_path', v)
		})
	}

	const props_container: IPropsContainer = {}

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

export default new window.$app.Handle(Index).by(observer).get()
