import { useRef } from 'react'

import { Content } from './components'
import { useRelated } from './hooks'
import styles from './index.css'

import type { IPropsTooltip } from './types'

const Index = (props: IPropsTooltip) => {
	const {
		task,
		rowHeight,
		rtl,
		svgContainerHeight,
		svgContainerWidth,
		scrollX,
		scrollY,
		arrowIndent,
		fontSize,
		fontFamily,
		headerHeight,
		taskListWidth
	} = props

	const tooltipRef = useRef<HTMLDivElement>(null)

	const [relatedX, relatedY] = useRelated({
		tooltipRef,
		task,
		arrowIndent,
		scrollX,
		scrollY,
		headerHeight,
		taskListWidth,
		rowHeight,
		svgContainerHeight,
		svgContainerWidth,
		rtl
	})

	return (
		<div
			className={relatedX ? styles.tooltipDetailsContainer : styles.tooltipDetailsContainerHidden}
			ref={tooltipRef}
			style={{ left: relatedX, top: relatedY }}
		>
			<Content {...{ task, fontSize, fontFamily }} />
		</div>
	)
}

export default Index
