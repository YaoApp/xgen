import type { Task, BarTask } from '@/types'
import type { RefObject } from 'react'

export interface IPropsTaskList {
	headerHeight: number
	rowWidth: string
	fontFamily: string
	fontSize: string
	rowHeight: number
	ganttHeight: number
	scrollY: number
	locale: string
	tasks: Task[]
	taskListRef: RefObject<HTMLDivElement>
	horizontalContainerClass?: string
	selectedTask: BarTask | undefined
	setSelectedTask: (task: string) => void
	onExpanderClick: (task: Task) => void
}

export interface IPropsHeader {
	headerHeight: number
	rowWidth: string
	fontFamily: string
	fontSize: string
}

export interface IPropsTable {
	rowHeight: number
	rowWidth: string
	fontFamily: string
	fontSize: string
	locale: string
	tasks: Task[]
	selectedTaskId: string | undefined
	onExpanderClick: (task: Task) => void
}

export interface IPropsTableRow extends Pick<IPropsTable, 'rowHeight' | 'rowWidth' | 'onExpanderClick'> {
	item: Task
	toLocaleDateString: (date: Date) => any
}
