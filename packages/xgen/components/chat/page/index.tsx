import { useState } from 'react'
import { ArrowSquareOut } from 'phosphor-react'
import styles from './index.less'
import type { Component } from '@/types'
import Loading from '../loading'
import { local, session } from '@yaoapp/storex'
import { getLocale } from '@umijs/max'

interface IProps extends Component.PropsChatComponent {
	url: string
	query?: Record<string, string>
	height?: number
	data?: Record<string, any>
}

const Index = (props: IProps) => {
	const { url, query = {}, height = 300, data = {} } = props
	const [loading, setLoading] = useState(true)

	const getToken = (): string => {
		const is_session_token = local.token_storage === 'sessionStorage'
		const token = is_session_token ? session.token : local.token
		return token || ''
	}

	const getTheme = (): string => {
		return (local.xgen_theme || 'light') as string
	}

	const handleIframeLoad = () => {
		setLoading(false)
	}

	const handleOpenInNewWindow = () => {
		window.open(finalUrl, '_blank')
	}

	const parseQuery = (query: Record<string, string>, data: Record<string, any>) => {
		const params = new URLSearchParams()
		for (const key in query) {
			const value = query[key]
			params.append(
				key,
				value.replace(/\[\[\s*([^\]]+)\s*\]\]/gi, (match, p1) => {
					p1 = p1.trim()
					return data?.[p1] || ''
				})
			)
		}
		return params
	}

	const queryData = {
		...data,
		__token: getToken(),
		__locale: getLocale(),
		__theme: getTheme()
	}

	const finalQuery = parseQuery(query, queryData)
	const finalUrl = `${url}?${finalQuery}`

	return (
		<div className={styles._local} style={{ height }}>
			{loading && <Loading />}
			<div className={styles.iframe_container}>
				<iframe src={finalUrl} onLoad={handleIframeLoad} className={styles.iframe} />
				<div className={styles.button_container}>
					<div
						className={styles.open_button}
						onClick={handleOpenInNewWindow}
						title='Open in new window'
					>
						<ArrowSquareOut size={16} />
					</div>
				</div>
			</div>
		</div>
	)
}

export default window.$app.memo(Index)
