import { Helmet, HelmetProvider } from 'react-helmet-async'

import config from '@/config'
import { Outlet } from '@umijs/pro'

import CssInit from './components/CssInit'

const Index = () => {
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
			<Outlet />
		</HelmetProvider>
	)
}

export default Index
