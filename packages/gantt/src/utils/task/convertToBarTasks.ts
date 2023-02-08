import { convertToBarTask } from './convertToBarTask'

import type { Task } from '@/types'

export const convertToBarTasks = (
	tasks: Task[],
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
) => {
	let barTasks = tasks.map((t, i) => {
		return convertToBarTask(
			t,
			i,
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
			barBackgroundSelectedColor,
			projectProgressColor,
			projectProgressSelectedColor,
			projectBackgroundColor,
			projectBackgroundSelectedColor,
			milestoneBackgroundColor,
			milestoneBackgroundSelectedColor
		)
	})

	barTasks = barTasks.map((task) => {
            const dependencies = task.dependencies || []
            
		for (let j = 0; j < dependencies.length; j++) {
                  const dependence = barTasks.findIndex((value) => value.id === dependencies[ j ])
                  
			if (dependence !== -1) barTasks[dependence].barChildren.push(task)
            }
            
		return task
	})

	return barTasks
}