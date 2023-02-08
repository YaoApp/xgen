import type { Task, BarTask } from '@/types'

import { taskXCoordinate, taskYCoordinate } from './coordinate'

export const convertToMilestone = (
	task: Task,
	index: number,
	dates: Date[],
	columnWidth: number,
	rowHeight: number,
	taskHeight: number,
	barCornerRadius: number,
	handleWidth: number,
	milestoneBackgroundColor: string,
	milestoneBackgroundSelectedColor: string
): BarTask => {
	const x = taskXCoordinate(task.start, dates, columnWidth)
	const y = taskYCoordinate(index, rowHeight, taskHeight)

	const x1 = x - taskHeight * 0.5
	const x2 = x + taskHeight * 0.5

	const rotatedHeight = taskHeight / 1.414
	const styles = {
		backgroundColor: milestoneBackgroundColor,
		backgroundSelectedColor: milestoneBackgroundSelectedColor,
		progressColor: '',
		progressSelectedColor: '',
		...task.styles
      }
      
	return {
		...task,
		end: task.start,
		x1,
		x2,
		y,
		index,
		progressX: 0,
		progressWidth: 0,
		barCornerRadius,
		handleWidth,
		typeInternal: task.type,
		progress: 0,
		height: rotatedHeight,
		hideChildren: undefined,
		barChildren: [],
		styles
	}
}
