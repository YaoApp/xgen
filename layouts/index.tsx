import { Helmet, HelmetProvider } from 'react-helmet-async'

import config from '@/config'
import { Outlet } from '@umijs/pro'

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
			<Outlet />
		</HelmetProvider>
	)
}

export default Index
