import clsx from 'clsx'
import { useState, useEffect, useCallback } from 'react'

import { ErrorCatcher } from '@/widgets'
import { history } from '@umijs/max'

import styles from './index.less'

import type { IPropsContainer } from '../../types'

const Index = (props: IPropsContainer & { children: React.ReactNode }) => {
	const {
		children,
		menu,
		visible_menu,
		show_name,
		hide_nav,
		sidebar_visible = false,
		sidebar_content,
		sidebar_hidden,
		sidebar_min_width = 360,
		sidebar_max_width = 960
	} = props
	const [sidebarVisible, setSidebarVisible] = useState(sidebar_visible)
	const [sidebarWidth, setSidebarWidth] = useState(sidebar_min_width)
	const [isAnimating, setIsAnimating] = useState(false)

	useEffect(() => {
		const onSetSidebarVisible = (visible?: boolean) => {
			setIsAnimating(true)
			setSidebarVisible(visible !== undefined ? visible : !sidebarVisible)
			setTimeout(() => setIsAnimating(false), 300)
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

	const handleResizeStart = useCallback(
		(e: React.MouseEvent<HTMLDivElement>) => {
			e.preventDefault()

			const startX = e.pageX
			const startWidth = sidebarWidth

			const handleMouseMove = (e: MouseEvent) => {
				const delta = startX - e.pageX
				const newWidth = Math.min(Math.max(startWidth + delta, sidebar_min_width), sidebar_max_width)
				setSidebarWidth(newWidth)
			}

			const handleMouseUp = () => {
				document.removeEventListener('mousemove', handleMouseMove)
				document.removeEventListener('mouseup', handleMouseUp)
			}

			document.addEventListener('mousemove', handleMouseMove)
			document.addEventListener('mouseup', handleMouseUp)
		},
		[sidebarWidth]
	)

	return (
		<div
			id='container'
			className={clsx([
				show_name ? styles._local_showname : styles._local,
				!hide_nav && (!menu?.length || !visible_menu) && styles.no_menu,
				hide_nav && styles.no_nav,
				history.location.pathname.indexOf('/iframe') !== -1 ? styles.iframe : '',
				sidebarVisible && styles.with_sidebar,
				isAnimating && styles.animating
			])}
			style={sidebarVisible && !sidebar_hidden ? { paddingRight: sidebarWidth } : undefined}
		>
			<div className='content_wrap w_100 border_box' style={{ paddingBottom: 90 }}>
				<ErrorCatcher>{children}</ErrorCatcher>
			</div>

			{!sidebar_hidden && (
				<div
					className={clsx(
						styles.right_sidebar,
						!sidebarVisible && styles.hidden,
						isAnimating && styles.animating
					)}
					style={{ width: sidebarWidth }}
				>
					<div className={styles.resize_handle} onMouseDown={handleResizeStart} />
					{sidebar_content}
				</div>
			)}
		</div>
	)
}

export default window.$app.memo(Index)
