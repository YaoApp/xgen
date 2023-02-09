import { useRef } from 'react'

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
		taskListWidth,
		TooltipContent
	} = props

	const tooltipRef = useRef<HTMLDivElement | null>(null)

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
			ref={tooltipRef}
			className={relatedX ? styles.tooltipDetailsContainer : styles.tooltipDetailsContainerHidden}
			style={{ left: relatedX, top: relatedY }}
		>
			<TooltipContent task={task} fontSize={fontSize} fontFamily={fontFamily} />
		</div>
	)
}

export default Index
