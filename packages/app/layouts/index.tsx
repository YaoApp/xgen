import { ConfigProvider } from 'antd'
import { observer } from 'mobx-react-lite'
import { Fragment, useLayoutEffect, useState } from 'react'
import { Helmet, HelmetProvider } from 'react-helmet-async'
import store from 'store2'
import { container } from 'tsyringe'

import config from '@/config'
import { GlobalContext, GlobalModel } from '@/context/app'
import InitCss from '@/styles/preset/init'
import { Outlet, useIntl, useLocation } from '@umijs/max'

import Container from './components/Container'
import Menu from './components/Menu'
import Nav from './components/Nav'

import type { IPropsNav, IPropsMenu, IPropsContainer } from './types'

const Index = () => {
	const { messages } = useIntl()
	const [global] = useState(() => container.resolve(GlobalModel))
	const menu = global.menu.slice()
	const { pathname } = useLocation()
	const is_login = pathname.indexOf('/login/') !== -1 || pathname === '/'

	useLayoutEffect(() => {
		global.locale_messages = messages
	}, [])

	const name = global.app_info.name

	const props_nav: IPropsNav = {
		theme: global.theme,
		avatar: global.avatar,
		app_info: global.app_info,
		user: global.user,
		menu: menu,
		visible_nav: global.visible_nav,
		current_nav: global.current_nav,
		setTheme: global.setTheme,
		setAvatar: global.setAvatar,
		setCurrentNav(current: GlobalModel['current_nav']) {
			global.current_nav = current
			global.current_menu = 0

			store.set('current_nav', current)
			store.set('current_menu', 0)
		},
		getUserMenu: global.getUserMenu
	}

	const props_menu: IPropsMenu = {
		visible: global.visible_menu,
		blocks: !!menu[global.current_nav]?.blocks,
		title: menu[global.current_nav]?.name,
		items: menu[global.current_nav]?.children || [],
		current_menu: global.current_menu,
		setCurrentMenu(current: GlobalModel['current_menu']) {
			global.current_menu = current

			store.set('current_menu', current)
		}
	}

	const props_container: IPropsContainer = {
		visible_nav: global.visible_nav,
		visible_menu: global.visible_menu
	}

	return (
		<HelmetProvider>
			<Helmet>
				<link
					rel='shortcut icon'
					type='image/x-icon'
					href={require('@/public/favicon.ico')}
				/>
				{global.theme === 'dark' && (
					<link rel='stylesheet' href={`/theme/dark.css`} />
				)}
				<style>{InitCss}</style>
				<title>
					{name ? `${name} - ${global.app_info.description}` : config.name}
				</title>
			</Helmet>
			<ConfigProvider prefixCls='xgen'>
				<GlobalContext.Provider value={global}>
					{is_login ? (
						<Outlet />
					) : (
						<Fragment>
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
