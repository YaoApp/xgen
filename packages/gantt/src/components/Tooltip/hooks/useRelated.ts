import { useMemo } from 'react'

import type { IPropsTooltip } from '../types'
import type { MutableRefObject } from 'react'

interface HookProps
	extends Pick<
		IPropsTooltip,
		| 'task'
		| 'arrowIndent'
		| 'scrollX'
		| 'scrollY'
		| 'headerHeight'
		| 'taskListWidth'
		| 'rowHeight'
		| 'svgContainerHeight'
		| 'svgContainerWidth'
		| 'rtl'
	> {
	tooltipRef: MutableRefObject<HTMLDivElement | null>
}

export default (props: HookProps) => {
	const {
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
	} = props

	return useMemo(() => {
		if (!tooltipRef.current) return [0, 0]

		const tooltipHeight = tooltipRef.current.offsetHeight * 1.1
		const tooltipWidth = tooltipRef.current.offsetWidth * 1.1
		let newRelatedY = task.index * rowHeight - scrollY + headerHeight
		let newRelatedX: number

		if (rtl) {
			newRelatedX = task.x1 - arrowIndent * 1.5 - tooltipWidth - scrollX

			if (newRelatedX < 0) {
				newRelatedX = task.x2 + arrowIndent * 1.5 - scrollX
			}

			const tooltipLeftmostPoint = tooltipWidth + newRelatedX

			if (tooltipLeftmostPoint > svgContainerWidth) {
				newRelatedX = svgContainerWidth - tooltipWidth
				newRelatedY += rowHeight
			}
		} else {
			newRelatedX = task.x2 + arrowIndent * 1.5 + taskListWidth - scrollX

			const tooltipLeftmostPoint = tooltipWidth + newRelatedX
			const fullChartWidth = taskListWidth + svgContainerWidth

			if (tooltipLeftmostPoint > fullChartWidth) {
				newRelatedX = task.x1 + taskListWidth - arrowIndent * 1.5 - scrollX - tooltipWidth
			}

			if (newRelatedX < taskListWidth) {
				newRelatedX = svgContainerWidth + taskListWidth - tooltipWidth
				newRelatedY += rowHeight
			}
		}

		const tooltipLowerPoint = tooltipHeight + newRelatedY - scrollY

		if (tooltipLowerPoint > svgContainerHeight - scrollY) {
			newRelatedY = svgContainerHeight - tooltipHeight
		}

		return [newRelatedX, newRelatedY]
	}, [
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
	])
}
