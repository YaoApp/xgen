import clsx from 'clsx'

import { ErrorCatcher } from '@/widgets'
import { history } from '@umijs/max'

import styles from './index.less'

import type { IPropsContainer } from '../../types'

const Index = (props: IPropsContainer & { children: React.ReactNode }) => {
	const { children, visible_nav, visible_menu, full } = props

	return (
		<div
			className={clsx([
				styles._local,
				!visible_menu ? styles.no_menu : '',
				!visible_menu && !visible_nav ? styles.no_nav : '',
				full ? styles.full : '',
				history.location.pathname.indexOf('/iframe') !== -1 ? styles.iframe : ''
			])}
		>
			<div className='content_wrap w_100 border_box'>
				<ErrorCatcher>{children}</ErrorCatcher>
			</div>
		</div>
	)
}

export default window.$app.memo(Index)
