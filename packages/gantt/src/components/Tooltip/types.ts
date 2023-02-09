import type { Task, BarTask } from '@/types'
import type { FC } from 'react'

export interface IPropsTooltip {
	task: BarTask
	arrowIndent: number
	rtl: boolean
	svgContainerHeight: number
	svgContainerWidth: number
	svgWidth: number
	headerHeight: number
	taskListWidth: number
	scrollX: number
	scrollY: number
	rowHeight: number
	fontSize: string
	fontFamily: string
	TooltipContent: FC<{
		task: Task
		fontSize: string
		fontFamily: string
	}>
}
