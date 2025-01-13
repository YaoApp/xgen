import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'

import { getLocale, useLocation } from '@umijs/max'
import { local, session } from '@yaoapp/storex'
import { App } from '@/types'
import { t } from '@wangeditor/editor'

const Index = () => {
	const { search } = useLocation()
	const [loading, setLoading] = useState(true)
	const ref = useRef<HTMLIFrameElement>(null)

	const getToken = (): string => {
		const is_session_token = local.token_storage === 'sessionStorage'
		const token = is_session_token ? session.token : local.token
		return token || ''
	}

	const getTheme = (): App.Theme => {
		const theme = (local.xgen_theme || 'light') as App.Theme
		return theme
	}

	const src = useMemo(() => {
		if (!search) return ''
		const src = search.split('?src=')?.[1]?.split('/_menu')[0] || ''
		if (!src) return ''
		const token = getToken()
		const theme = getTheme()
		const locale = getLocale()
		const url = decodeURIComponent(src)
		const re = /{{\s*([^}]+)\s*}}/gi
		const replace = (match: string, p1: string) => {
			p1 = p1.trim()
			if (p1 === '__token') return token
			if (p1 === '__theme') return theme
			if (p1 === '__locale') return locale
			return ''
		}
		return url.replace(re, replace)
	}, [search])

	useLayoutEffect(() => {
		document.body.style.overflow = 'hidden'
		return () => {
			document.body.style.overflow = 'auto'
		}
	}, [])

	// Add event listener to receive message from iframe
	// Next version will use postMessage to communicate between iframe and parent window
	useEffect(() => {
		// Receive message from iframe
		const message = (e: MessageEvent) => {
			// const data = e.data || {}
			// const { type, value, bind, namespace } = data
			// console.debug('message', type, value, bind, namespace)
		}
		window.addEventListener('message', message)
		return () => window.removeEventListener('message', message)
	}, [])

	return (
		<iframe
			className='w_100 h_100vh'
			ref={ref}
			src={src}
			onLoad={() => setLoading(false)}
			style={{ backgroundColor: 'var(--color_bg)', border: 'none', display: loading ? 'none' : 'block' }}
		></iframe>
	)
}

export default window.$app.memo(Index)
