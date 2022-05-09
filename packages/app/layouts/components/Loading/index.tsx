import clsx from 'clsx'

import styles from './index.less'

import type { IPropsLoading } from '../../types'

const Index = (props: IPropsLoading) => {
	const { loading, visible_nav, visible_menu } = props

	if (!loading) return null

	return (
		<div
			className={clsx([
				styles._local,
                        !visible_menu ? styles.no_menu : '',
				!visible_menu && !visible_nav ? styles.no_nav : '',
				'fixed top_0 left_0 z_index_1000 h_100vh flex flex_column align_center justify_center'
			])}
		>
			<div className='inner mb_20' />
			<div className='text'>loading</div>
		</div>
	)
}

export default window.$app.memo(Index)
