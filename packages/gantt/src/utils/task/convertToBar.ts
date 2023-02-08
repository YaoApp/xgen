import type { Task, BarTask, TaskTypeInternal } from '@/types'

import { taskXCoordinate, taskXCoordinateRTL, taskYCoordinate } from './coordinate'
import { progressWithByParams } from './progress'

export const convertToBar = (
	task: Task,
	index: number,
	dates: Date[],
	columnWidth: number,
	rowHeight: number,
	taskHeight: number,
	barCornerRadius: number,
	handleWidth: number,
	rtl: boolean,
	barProgressColor: string,
	barProgressSelectedColor: string,
	barBackgroundColor: string,
	barBackgroundSelectedColor: string
): BarTask => {
	let x1: number
	let x2: number

	if (rtl) {
		x2 = taskXCoordinateRTL(task.start, dates, columnWidth)
		x1 = taskXCoordinateRTL(task.end, dates, columnWidth)
	} else {
		x1 = taskXCoordinate(task.start, dates, columnWidth)
		x2 = taskXCoordinate(task.end, dates, columnWidth)
	}

	let typeInternal: TaskTypeInternal = task.type

	if (typeInternal === 'task' && x2 - x1 < handleWidth * 2) {
		typeInternal = 'smalltask'
		x2 = x1 + handleWidth * 2
	}

	const [progressWidth, progressX] = progressWithByParams(x1, x2, task.progress, rtl)
	const y = taskYCoordinate(index, rowHeight, taskHeight)
	const hideChildren = task.type === 'project' ? task.hideChildren : undefined

	const styles = {
		backgroundColor: barBackgroundColor,
		backgroundSelectedColor: barBackgroundSelectedColor,
		progressColor: barProgressColor,
		progressSelectedColor: barProgressSelectedColor,
		...task.styles
	}

	return {
		...task,
		typeInternal,
		x1,
		x2,
		y,
		index,
		progressX,
		progressWidth,
		barCornerRadius,
		handleWidth,
		hideChildren,
		height: taskHeight,
		barChildren: [],
		styles
	}
}
