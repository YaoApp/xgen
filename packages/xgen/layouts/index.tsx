import '@/styles/index.less'

import { ConfigProvider } from 'antd'
import { observer } from 'mobx-react-lite'
import { useLayoutEffect, useState } from 'react'
import { HelmetProvider } from 'react-helmet-async'
import { container } from 'tsyringe'

import { GlobalContext, GlobalModel } from '@/context/app'
import { useIntl } from '@/hooks'
import { Outlet, useLocation } from '@umijs/max'

import Helmet from './components/Helmet'
import LoginWrapper from './wrappers/Login'
import AuthWrapper from './wrappers/Auth'
import AdminWrapper from './wrappers/Admin'
import ChatWrapper from './wrappers/Chat'

import type { IPropsHelmet, IPropsLoginWrapper } from './types'

const Index = () => {
	const messages = useIntl()
	const [global] = useState(() => container.resolve(GlobalModel))
	const { pathname, search } = useLocation()
	const is_login = pathname.indexOf('/login/') !== -1 || pathname === '/'
	const is_auth = pathname === '/auth'

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

	const renderMainContent = () => {
		if (is_login) {
			return (
				<LoginWrapper {...props_Login_wrapper}>
					<Outlet />
				</LoginWrapper>
			)
		}

		if (is_auth) {
			return (
				<AuthWrapper {...props_Login_wrapper}>
					<Outlet />
				</AuthWrapper>
			)
		}

		if (global.layout === 'Chat') {
			return (
				<ChatWrapper>
					<Outlet />
				</ChatWrapper>
			)
		}

		return (
			<AdminWrapper>
				<Outlet />
			</AdminWrapper>
		)
	}

	return (
		<HelmetProvider>
			<Helmet {...props_helmet}></Helmet>
			<ConfigProvider prefixCls='xgen'>
				<GlobalContext.Provider value={global}>{renderMainContent()}</GlobalContext.Provider>
			</ConfigProvider>
		</HelmetProvider>
	)
}

export default new window.$app.Handle(Index).by(observer).get()
