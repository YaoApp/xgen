import { Helmet } from 'react-helmet-async'

import config from '@/config'
import InitCss from '@/styles/preset/init'

import type { IPropsHelmet } from '../types'

const Index = (props: IPropsHelmet) => {
	const { theme, app_info } = props

	return (
		<Helmet>
			<link
				rel='shortcut icon'
				type='image/x-icon'
				href={app_info.favicon ?? require('@/public/favicon.ico')}
			/>
			{theme === 'dark' && (
				<link rel='stylesheet' href={`/${$runtime.BASE}/theme/dark.css`} />
			)}
			<style>{InitCss}</style>
			<title>
				{app_info.name ? `${app_info.name} - ${app_info.description}` : config.name}
			</title>
		</Helmet>
	)
}

export default window.$app.memo(Index)
