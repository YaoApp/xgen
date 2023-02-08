import type { Task } from '@/types'

export const sortTasks = (taskA: Task, taskB: Task) => {
	const orderA = taskA.displayOrder || Number.MAX_VALUE
	const orderB = taskB.displayOrder || Number.MAX_VALUE

	if (orderA > orderB) {
		return 1
	} else if (orderA < orderB) {
		return -1
	} else {
		return 0
	}
}
