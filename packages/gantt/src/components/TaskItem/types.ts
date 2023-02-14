import type { BarTask, GanttContentMoveAction } from '@/types'
import type { MouseEvent, KeyboardEvent } from 'react'

export interface IPropsTaskItem {
	task: BarTask
	arrowIndent: number
	taskHeight: number
	isProgressChangeable: boolean
	isDateChangeable: boolean
	isDelete: boolean
	isSelected: boolean
	rtl: boolean
	onEventStart: (action: GanttContentMoveAction, selectedTask: BarTask, event?: MouseEvent | KeyboardEvent) => any
}

export interface IPropsBar
	extends Pick<
		IPropsTaskItem,
		'task' | 'isProgressChangeable' | 'isDateChangeable' | 'isSelected' | 'rtl' | 'onEventStart'
	> {}

export interface IPropsMilestone
	extends Pick<IPropsTaskItem, 'task' | 'isDateChangeable' | 'isSelected' | 'onEventStart'> {}

export interface IPropsProject extends Pick<IPropsTaskItem, 'task' | 'isSelected'> {}

export interface IPropsSmallBar
	extends Pick<
		IPropsTaskItem,
		'task' | 'isProgressChangeable' | 'isDateChangeable' | 'isSelected' | 'onEventStart'
	> {}
