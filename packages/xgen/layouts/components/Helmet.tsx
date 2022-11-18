import { Fragment } from 'react'
import { Helmet } from 'react-helmet-async'

import config from '@/config'

import type { IPropsHelmet } from '../types'

const Index = (props: IPropsHelmet) => {
	const { theme, app_info } = props

	return (
		<Fragment>
			<Helmet>
				<link
					rel='shortcut icon'
					type='image/x-icon'
					href={app_info.favicon ?? require('@/public/favicon.ico')}
				/>
				<link rel='stylesheet' href={`/${$runtime.BASE}/theme/${theme}.css`} />
				<title>{app_info.name ? `${app_info.name} - ${app_info.description}` : config.name}</title>
			</Helmet>
		</Fragment>
	)
}

export default window.$app.memo(Index)
