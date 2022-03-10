import { ConfigProvider } from 'antd'
import { observer } from 'mobx-react-lite'
import { useState } from 'react'
import { Helmet, HelmetProvider } from 'react-helmet-async'

import config from '@/config'
import { GlobalContext, GlobalModel } from '@/context/app'
import { Outlet } from '@umijs/pro'

import CssInit from './components/CssInit'

const Index = () => {
	const [global] = useState(() => new GlobalModel())

	return (
		<HelmetProvider>
			<Helmet>
				<link
					rel='shortcut icon'
					type='image/x-icon'
					href={require('@/public/favicon.ico')}
				/>
				<title>{config.name}</title>
			</Helmet>
			<CssInit />
			<ConfigProvider prefixCls={`xgen-${global.theme}`}>
				<GlobalContext.Provider value={global}>
					<Outlet />
				</GlobalContext.Provider>
			</ConfigProvider>
		</HelmetProvider>
	)
}

export default new window.$app.Handle(Index).by(observer).by(window.$app.memo).get()
