import type { Task } from '@/types'

import { getTaskChildren } from './getTaskChildren'

export const removeHiddenTasks = (tasks: Task[]) => {
	const groupedTasks = tasks.filter((t) => t.hideChildren && t.type === 'project')

	if (groupedTasks.length > 0) {
		for (let i = 0; groupedTasks.length > i; i++) {
			const groupedTask = groupedTasks[i]
			const children = getTaskChildren(tasks, groupedTask)

			tasks = tasks.filter((t) => children.indexOf(t) === -1)
		}
	}

	return tasks
}
