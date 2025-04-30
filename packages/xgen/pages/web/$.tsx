import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'

import { getLocale, useLocation } from '@umijs/max'
import { local, session } from '@yaoapp/storex'
import { App } from '@/types'
import { useAction } from '@/actions'

const Index = () => {
	const { search, pathname } = useLocation()

	const [loading, setLoading] = useState(true)
	const ref = useRef<HTMLIFrameElement>(null)

	const onAction = useAction()

	const getToken = (): string => {
		const is_session_token = local.token_storage === 'sessionStorage'
		const token = is_session_token ? session.token : local.token
		return token || ''
	}

	const getTheme = (): App.Theme => {
		const theme = (local.xgen_theme || 'light') as App.Theme
		return theme
	}

	const handlers: Record<string, () => string> = {
		__token: getToken,
		__theme: getTheme,
		__locale: getLocale
	}

	const src = useMemo(() => {
		const url = pathname.replace(/^\/web/, '')
		const params = new URLSearchParams(search)
		params.forEach((value, key) => handlers[value] && params.set(key, handlers[value]()))
		return url + (params.size > 0 ? '?' + params.toString() : '')
	}, [search, pathname])

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
			const data = e.data || {}
			const { extra, data_item = {}, action, primary, namespace } = data
			try {
				onAction({ namespace, primary, data_item, it: { action, title: '', icon: '' }, extra })
			} catch (err) {
				console.error('Failed to run action:', err)
				console.debug('--- Receive message from iframe ---')
				console.debug(data)
				console.debug('---')
			}
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
