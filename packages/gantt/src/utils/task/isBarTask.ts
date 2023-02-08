import type { Task, BarTask } from '@/types'

export const isBarTask = (task: Task | BarTask): task is BarTask => {
	return (task as BarTask).x1 !== undefined
}
