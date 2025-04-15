import AIChat from '../AIChat'
import styles from './index.less'
import type { IPropsNeo } from '../../../layouts/types'
import { useRef, useEffect, useState } from 'react'
import clsx from 'clsx'

// Base breakpoint width (in pixels) at which the layout switches to small screen mode
// When content width is less than or equal to this value, the layout will switch to small screen mode
export const NEO_PAGE_BREAKPOINT = 460

// Single side padding (in pixels) for the page content
// Applied to both left and right sides when not in small screen mode
export const NEO_PAGE_PADDING = 32

const Index = (props: IPropsNeo) => {
	const containerRef = useRef<HTMLDivElement>(null)
	const [containerWidth, setContainerWidth] = useState<number>(0)

	useEffect(() => {
		if (!containerRef.current) return

		const resizeObserver = new ResizeObserver((entries) => {
			const parentWidth = containerRef.current?.parentElement?.clientWidth
			if (parentWidth) setContainerWidth(parentWidth)
		})

		resizeObserver.observe(containerRef.current)
		return () => resizeObserver.disconnect()
	}, [])

	// Simply check if the content width is below or equal to the breakpoint
	const isSmallScreen = containerWidth <= NEO_PAGE_BREAKPOINT
	const containerStyle = isSmallScreen
		? {
				borderRadius: 0,
				padding: 0,
				margin: 0,
				width: '100%',
				flex: 1
		  }
		: {}

	return (
		<div
			ref={containerRef}
			className={clsx(styles.container, isSmallScreen && styles.smallScreen)}
			style={containerStyle}
		>
			<AIChat
				className={clsx(styles.aiChat, isSmallScreen && styles.smallScreenChat)}
				title='AI Assistant'
				headerButtons={['new', 'history']}
				currentPage={'chat/index'}
				onNew={() => {
					/* handle new */
				}}
				onClose={() => {
					/* handle close */
				}}
			/>
		</div>
	)
}

export default Index
