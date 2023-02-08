import { convertToBar } from './convertToBar'
import { convertToMilestone } from './convertToMilestone'

import type { Task, BarTask } from '@/types'

export const convertToBarTask = (
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
	barBackgroundSelectedColor: string,
	projectProgressColor: string,
	projectProgressSelectedColor: string,
	projectBackgroundColor: string,
	projectBackgroundSelectedColor: string,
	milestoneBackgroundColor: string,
	milestoneBackgroundSelectedColor: string
): BarTask => {
	let barTask: BarTask

	switch (task.type) {
		case 'milestone':
			barTask = convertToMilestone(
				task,
				index,
				dates,
				columnWidth,
				rowHeight,
				taskHeight,
				barCornerRadius,
				handleWidth,
				milestoneBackgroundColor,
				milestoneBackgroundSelectedColor
			)
			break
		case 'project':
			barTask = convertToBar(
				task,
				index,
				dates,
				columnWidth,
				rowHeight,
				taskHeight,
				barCornerRadius,
				handleWidth,
				rtl,
				projectProgressColor,
				projectProgressSelectedColor,
				projectBackgroundColor,
				projectBackgroundSelectedColor
			)
			break
		default:
			barTask = convertToBar(
				task,
				index,
				dates,
				columnWidth,
				rowHeight,
				taskHeight,
				barCornerRadius,
				handleWidth,
				rtl,
				barProgressColor,
				barProgressSelectedColor,
				barBackgroundColor,
				barBackgroundSelectedColor
			)
			break
      }
      
	return barTask
}
