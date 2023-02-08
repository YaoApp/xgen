import type { Task, BarTask } from './task'
import type { DisplayOption } from './display_option'
import type { StylingOption } from './styling_option'
import type { EventOption } from './event_option'

export * from './date'
export * from './task'
export * from './display_option'
export * from './styling_option'
export * from './event_option'

export interface GanttProps extends DisplayOption, StylingOption, EventOption {
	tasks: Task[]
}

export type BarMoveAction = 'progress' | 'end' | 'start' | 'move'

export type GanttContentMoveAction =
	| BarMoveAction
	| 'mouseenter'
	| 'mouseleave'
	| 'delete'
	| 'dblclick'
	| 'click'
	| 'select'
	| ''

export type GanttEvent = {
	changedTask?: BarTask
	originalSelectedTask?: BarTask
	action: GanttContentMoveAction
}
