import AIChat from '../components/AIChat'
import styles from './index.less'
import type { IPropsNeo } from '../../../types'
import { useRef, useEffect, useState } from 'react'
import clsx from 'clsx'

// Base breakpoint width (in pixels) at which the layout switches to small screen mode
// This is the minimum content width (excluding padding) needed for normal layout
export const NEO_PAGE_BREAKPOINT = 460

// Single side padding (in pixels) for the page content
// Applied to both left and right sides when not in small screen mode
export const NEO_PAGE_PADDING = 32

// Total padding (in pixels) for both sides combined
// Used in width calculations for responsive behavior
export const NEO_PAGE_TOTAL_PADDING = NEO_PAGE_PADDING * 2

const Index = (props: IPropsNeo) => {
	const containerRef = useRef<HTMLDivElement>(null)
	const [containerWidth, setContainerWidth] = useState<number>(0)

	useEffect(() => {
		if (!containerRef.current) return

		const resizeObserver = new ResizeObserver((entries) => {
			const width = entries[0]?.contentRect.width
			if (width) setContainerWidth(width)
		})

		resizeObserver.observe(containerRef.current)
		return () => resizeObserver.disconnect()
	}, [])

	// First check if we have enough space for content + padding
	const hasSpaceForPadding = containerWidth > NEO_PAGE_BREAKPOINT + NEO_PAGE_TOTAL_PADDING
	// If we have space for padding, check if the remaining content width is sufficient
	const actualContentWidth = hasSpaceForPadding ? containerWidth - NEO_PAGE_TOTAL_PADDING : containerWidth
	const isSmallScreen = actualContentWidth <= NEO_PAGE_BREAKPOINT

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
