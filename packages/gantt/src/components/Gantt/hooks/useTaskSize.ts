import { useEffect } from 'react'

import type { GanttProps } from '@/types'
import type { RefObject } from 'react'

interface HookProps
	extends Pick<Required<GanttProps>, 'listCellWidth' | 'ganttHeight' | 'tasks' | 'headerHeight' | 'rowHeight'> {
	wrapperRef: RefObject<HTMLDivElement>
	taskListRef: RefObject<HTMLDivElement>
	taskListWidth: number
	setTaskListWidth: (v: number) => void
	setSvgContainerWidth: (v: number) => void
	setSvgContainerHeight: (v: number) => void
}

export default (props: HookProps) => {
	const {
		listCellWidth,
		ganttHeight,
		tasks,
		headerHeight,
		wrapperRef,
		rowHeight,
		taskListRef,
		taskListWidth,
		setTaskListWidth,
		setSvgContainerWidth,
		setSvgContainerHeight
	} = props

	useEffect(() => {
		if (!listCellWidth) setTaskListWidth(0)
		if (taskListRef.current) setTaskListWidth(taskListRef.current.offsetWidth)
	}, [taskListRef, listCellWidth])

	useEffect(() => {
		if (wrapperRef.current) setSvgContainerWidth(wrapperRef.current.offsetWidth - taskListWidth)
	}, [wrapperRef, taskListWidth])

	useEffect(() => {
		if (ganttHeight) {
			setSvgContainerHeight(ganttHeight + headerHeight)
		} else {
			setSvgContainerHeight(tasks.length * rowHeight + headerHeight)
		}
	}, [ganttHeight, tasks, headerHeight, rowHeight])
}
