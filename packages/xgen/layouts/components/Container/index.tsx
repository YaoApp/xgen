import clsx from 'clsx'
import { useState, useEffect } from 'react'

import { ErrorCatcher } from '@/widgets'
import { history } from '@umijs/max'

import styles from './index.less'

import type { IPropsContainer } from '../../types'

const Index = (props: IPropsContainer & { children: React.ReactNode }) => {
	const { children, menu, visible_menu, show_name, hide_nav, sidebar_visible = false, sidebar_content } = props
	const [sidebarVisible, setSidebarVisible] = useState(sidebar_visible)

	useEffect(() => {
		const onSetSidebarVisible = (visible?: boolean) => {
			setSidebarVisible(visible !== undefined ? visible : !sidebarVisible)
		}
		const onToggleSidebarVisible = () => {
			setSidebarVisible(!sidebarVisible)
		}
		window.$app.Event.on('app/setSidebarVisible', onSetSidebarVisible)
		window.$app.Event.on('app/toggleSidebarVisible', onToggleSidebarVisible)
		return () => {
			window.$app.Event.off('app/setSidebarVisible', onSetSidebarVisible)
			window.$app.Event.off('app/toggleSidebarVisible', onToggleSidebarVisible)
		}
	}, [sidebarVisible])

	return (
		<div
			id='container'
			className={clsx([
				show_name ? styles._local_showname : styles._local,
				!hide_nav && (!menu?.length || !visible_menu) && styles.no_menu,
				hide_nav && styles.no_nav,
				history.location.pathname.indexOf('/iframe') !== -1 ? styles.iframe : '',
				sidebarVisible && styles.with_sidebar
			])}
		>
			<div className='content_wrap w_100 border_box' style={{ paddingBottom: 90 }}>
				<ErrorCatcher>{children}</ErrorCatcher>
			</div>

			<div className={clsx(styles.right_sidebar, !sidebarVisible && styles.hidden)}>{sidebar_content}</div>
		</div>
	)
}

export default window.$app.memo(Index)
