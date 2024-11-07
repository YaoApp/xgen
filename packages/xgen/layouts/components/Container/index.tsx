import clsx from 'clsx'

import { ErrorCatcher } from '@/widgets'
import { history } from '@umijs/max'

import styles from './index.less'

import type { IPropsContainer } from '../../types'

const Index = (props: IPropsContainer & { children: React.ReactNode }) => {
	const { children, menu, visible_menu, show_name, hide_nav } = props
	return (
		<div
			id='container'
			className={clsx([
				show_name ? styles._local_showname : styles._local,
				!hide_nav && (!menu?.length || !visible_menu) && styles.no_menu,
				hide_nav && styles.no_nav,
				history.location.pathname.indexOf('/iframe') !== -1 ? styles.iframe : ''
			])}
		>
			<div className='content_wrap w_100 border_box' style={{ paddingBottom: 90 }}>
				<ErrorCatcher>{children}</ErrorCatcher>
			</div>
		</div>
	)
}

export default window.$app.memo(Index)
