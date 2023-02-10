import type { Task, BarTask } from '@/types'

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
}

export interface IPropsTooltipContent {
	task: Task
	fontSize: string
	fontFamily: string
}
