import clsx from 'clsx'
import { AnimatePresence, motion } from 'framer-motion'

import styles from './index.less'

import type { IPropsLoading } from '../../types'

const Index = (props: IPropsLoading) => {
	const { loading, menu, visible_menu, show_name } = props

	return (
		<AnimatePresence>
			{loading && (
				<motion.div
					className={clsx([
						show_name ? styles._local_showname : styles._local,
						(!menu?.length || !visible_menu) && styles.no_menu,
						'fixed top_0 left_0 z_index_1000 h_100vh flex flex_column align_center justify_center'
					])}
					animate={{ opacity: 1 }}
					exit={{ opacity: 0 }}
					transition={{ delay: 0.18, duration: 0.15, ease: 'backOut' }}
				>
					<div className='inner mb_20' />
					<div className='text'>loading</div>
				</motion.div>
			)}
		</AnimatePresence>
	)
}

export default window.$app.memo(Index)
