import { ConfigProvider } from 'antd'
import { observer } from 'mobx-react-lite'
import { useState } from 'react'
import { Helmet, HelmetProvider } from 'react-helmet-async'
import { container } from 'tsyringe'

import config from '@/config'
import { GlobalContext, GlobalModel } from '@/context/app'
import InitCss from '@/styles/preset/init'
import { Outlet, useIntl } from '@umijs/pro'

const Index = () => {
	const { messages } = useIntl()
	const [global] = useState(() => container.resolve(GlobalModel))

	global.locale_messages = messages

	const name = global.app_info.name

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
					<Outlet />
				</GlobalContext.Provider>
			</ConfigProvider>
		</HelmetProvider>
	)
}

export default new window.$app.Handle(Index).by(observer).by(window.$app.memo).get()
