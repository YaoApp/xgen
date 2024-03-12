import { useAsyncEffect } from 'ahooks'
import { observer } from 'mobx-react-lite'
import { useState } from 'react'
import { container } from 'tsyringe'
import clsx from 'clsx'

import Model from '@/pages/login/model'
import styles from './index.less'
import { useGlobal } from '@/context/app'
import { AnimatePresence, motion } from 'framer-motion'
import { useLocation } from '@umijs/max'
import { ResLogin } from '../login/types'

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
			const text = decodeURIComponent(atob(base64 || ''))
			const data = JSON.parse(text) as ResLogin
			auth.afterLogin(data, undefined)
		} catch (err: any) {
			setError(err?.message || 'Invalid data')
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
