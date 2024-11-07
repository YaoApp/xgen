import { useAsyncEffect } from 'ahooks'
import { observer } from 'mobx-react-lite'
import { useState } from 'react'
import { container } from 'tsyringe'
import clsx from 'clsx'

import Model from '@/pages/login/model'
import styles from './index.less'
import { useGlobal } from '@/context/app'
import { AnimatePresence, motion } from 'framer-motion'
import { useLocation, history } from '@umijs/max'
import { ResLogin } from '../login/types'
import { local } from '@yaoapp/storex'

const Index = () => {
	const global = useGlobal()
	const [auth] = useState(() => container.resolve(Model))
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState('')

	const url = useLocation()
	const query = new URLSearchParams(url.search)
	const base64 = query.get('data')

	useAsyncEffect(async () => {
		await window.$app.Event.emit('app/getAppInfo')
		// Parse data
		try {
			const text = decodeURIComponent(Buffer.from(base64 || '', 'base64').toString())
			const data = JSON.parse(text) as ResLogin
			auth.afterLogin(data, undefined)
		} catch (err: any) {
			const errStr = err?.message || 'Invalid data'
			if (!local.logout_redirect) {
				const locPath = local.login_url || '/'
				history.push(`${locPath}?error=${errStr}`)
			}
			// Redirect to the custom logout page
			if (local.logout_redirect) {
				window.location.href = local.logout_redirect + `?error=${errStr}`
				return
			}
		}
	}, [])

	return (
		<div className={clsx([styles._local, 'w_100 h_100vh flex flex_column justify_center align_center'])}>
			<AnimatePresence>
				{loading && (
					<motion.div
						className={clsx(['flex flex_column align_center justify_center'])}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						transition={{ delay: 0.18, duration: 0.15, ease: 'backOut' }}
					>
						<div className='inner mb_20' />
						<div className={clsx(['text', error != '' && 'danger'])}>
							{error != '' ? error : global.locale_messages?.layout?.auth?.loading}
						</div>
					</motion.div>
				)}
			</AnimatePresence>
		</div>
	)
}

export default new window.$app.Handle(Index).by(observer).get()
