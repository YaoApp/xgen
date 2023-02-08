import type { Task } from './task'

export interface EventOption {
	timeStep?: number
	onSelect?: (task: Task, isSelected: boolean) => void
	onDoubleClick?: (task: Task) => void
	onClick?: (task: Task) => void
	onDateChange?: (task: Task, children: Task[]) => void | boolean | Promise<void> | Promise<boolean>
	onProgressChange?: (task: Task, children: Task[]) => void | boolean | Promise<void> | Promise<boolean>
	onDelete?: (task: Task) => void | boolean | Promise<void> | Promise<boolean>
	onExpanderClick?: (task: Task) => void
}
