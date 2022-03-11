import { ConfigProvider } from 'antd'
import { observer } from 'mobx-react-lite'
import { useState } from 'react'
import { Helmet, HelmetProvider } from 'react-helmet-async'
import { container } from 'tsyringe'

import config from '@/config'
import { GlobalContext, GlobalModel } from '@/context/app'
import { Outlet } from '@umijs/pro'

const Index = () => {
	const [global] = useState(() => container.resolve(GlobalModel))

	return (
		<HelmetProvider>
			<Helmet>
				<link
					rel='shortcut icon'
					type='image/x-icon'
					href={require('@/public/favicon.ico')}
				/>
				<link rel='stylesheet' href={`/theme/light.css`} />
				{global.theme === 'dark' && (
					<link rel='stylesheet' href={`/theme/dark.css`} />
				)}
				<title>{config.name}</title>
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
