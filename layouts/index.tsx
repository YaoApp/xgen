import { Helmet, HelmetProvider } from 'react-helmet-async'
import { Outlet } from 'umi'

import config from '@/config'

const Index = () => {
	return (
		<HelmetProvider>
			<Helmet>
				<link
					rel='shortcut icon'
					type='image/x-icon'
					href={require('@/assets/favicon.ico')}
				/>
				<title>{config.name}</title>
			</Helmet>
			<Outlet />
		</HelmetProvider>
	)
}

export default Index
