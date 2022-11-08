import { useLayoutEffect, useMemo } from 'react'

import { history } from '@umijs/max'

const Index = () => {
	const { location } = history

	const src = useMemo(() => {
		if (!location.search) return ''

		return new URLSearchParams(location.search).get('src') || ''
	}, [location.search])

	useLayoutEffect(() => {
		document.body.style.overflow = 'hidden'

		return () => {
			document.body.style.overflow = 'auto'
		}
	}, [])

	return (
		<iframe
			className='w_100 h_100vh'
			src={src}
			frameBorder='0'
			style={{ backgroundColor: 'var(--color_bg)' }}
		></iframe>
	)
}

export default window.$app.memo(Index)
