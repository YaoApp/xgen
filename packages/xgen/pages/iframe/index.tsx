import { useLayoutEffect, useMemo } from 'react'

import { useLocation } from '@umijs/max'

const Index = () => {
	const { search } = useLocation()

	const src = useMemo(() => {
		if (!search) return ''
		return search.split('?src=')[1].split('/_menu')[0]
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
			style={{ backgroundColor: 'var(--color_bg)', border: 'none' }}
		></iframe>
	)
}

export default window.$app.memo(Index)
