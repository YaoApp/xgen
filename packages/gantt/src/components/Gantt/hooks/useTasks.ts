import { useEffect } from 'react'

import { convertToBarTasks, ganttDateRange, removeHiddenTasks, seedDates, sortTasks } from '@/utils'

import type { GanttProps, DateSetup, BarTask } from '@/types'

interface HookProps
	extends Pick<
			Required<GanttProps>,
			| 'tasks'
			| 'viewMode'
			| 'preStepsCount'
			| 'rowHeight'
			| 'barCornerRadius'
			| 'columnWidth'
			| 'handleWidth'
			| 'barProgressColor'
			| 'barProgressSelectedColor'
			| 'barBackgroundColor'
			| 'barBackgroundSelectedColor'
			| 'projectProgressColor'
			| 'projectProgressSelectedColor'
			| 'projectBackgroundColor'
			| 'projectBackgroundSelectedColor'
			| 'milestoneBackgroundColor'
			| 'milestoneBackgroundSelectedColor'
			| 'rtl'
		>,
		Pick<GanttProps, 'onExpanderClick'> {
	scrollX: number
	taskHeight: number
	setScrollX: (v: number) => void
	setDateSetup: (v: DateSetup) => void
	setBarTasks: (v: Array<BarTask>) => void
}

export default (props: HookProps) => {
	const {
		tasks,
		viewMode,
		preStepsCount,
		rowHeight,
		barCornerRadius,
		columnWidth,
		taskHeight,
		handleWidth,
		barProgressColor,
		barProgressSelectedColor,
		barBackgroundColor,
		barBackgroundSelectedColor,
		projectProgressColor,
		projectProgressSelectedColor,
		projectBackgroundColor,
		projectBackgroundSelectedColor,
		milestoneBackgroundColor,
		milestoneBackgroundSelectedColor,
		rtl,
		scrollX,
		onExpanderClick,
		setScrollX,
		setDateSetup,
		setBarTasks
	} = props

	useEffect(() => {
		const filteredTasks = (onExpanderClick ? removeHiddenTasks(tasks) : tasks).sort(sortTasks)
		const [startDate, endDate] = ganttDateRange(filteredTasks, viewMode, preStepsCount)

		let newDates = seedDates(startDate, endDate, viewMode)

		if (rtl) {
			newDates = newDates.reverse()

			if (scrollX === -1) setScrollX(newDates.length * columnWidth)
		}

		setDateSetup({ dates: newDates, viewMode })

		setBarTasks(
			convertToBarTasks(
				filteredTasks,
				newDates,
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
		)
	}, [
		tasks,
		viewMode,
		preStepsCount,
		rowHeight,
		barCornerRadius,
		columnWidth,
		taskHeight,
		handleWidth,
		barProgressColor,
		barProgressSelectedColor,
		barBackgroundColor,
		barBackgroundSelectedColor,
		projectProgressColor,
		projectProgressSelectedColor,
		projectBackgroundColor,
		projectBackgroundSelectedColor,
		milestoneBackgroundColor,
		milestoneBackgroundSelectedColor,
		rtl,
		scrollX
	])
}
