import { useLayoutEffect, useMemo } from 'react'

import { useLocation } from '@umijs/max'

const Index = () => {
	const { search } = useLocation()

	const src = useMemo(() => {
		if (!search) return ''

		return new URLSearchParams(search).get('src') || ''
	}, [search])

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
