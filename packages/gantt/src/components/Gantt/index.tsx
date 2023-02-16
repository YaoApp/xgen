import { useMemoizedFn } from 'ahooks'
import { SyntheticEvent, useRef, useState } from 'react'

import { ViewMode } from '@/types'
import { ganttDateRange, seedDates } from '@/utils'

import HorizontalScroll from '../HorizontalScroll'
import Task from '../Task'
import TaskList from '../TaskList'
import Tooltip from '../Tooltip'
import VerticalScroll from '../VerticalScroll'
import { useChangedTask, useCurrent, useFailedTask, useTaskHeight, useTasks, useTaskSize, useWheel } from './hooks'
import styles from './index.css'

import type { GanttProps, BarTask, GanttEvent, DateSetup, Task as TaskType } from '@/types'
import type { IPropsTask } from '../Task/types'
import type { IPropsTaskList } from '../TaskList/types'
import type { IPropsTooltip } from '../Tooltip/types'
import type { IPropsVerticalScroll } from '../VerticalScroll/types'
import type { IPropsHorizontalScroll } from '../HorizontalScroll/types'

const Index = (props: GanttProps) => {
	const {
		tasks,
		headerHeight = 50,
		columnWidth = 60,
		listCellWidth = '155px',
		rowHeight = 50,
		ganttHeight = 0,
		viewMode = ViewMode.Day,
		preStepsCount = 1,
		locale = 'en-GB',
		barFill = 60,
		barCornerRadius = 3,
		barProgressColor = '#a3a3ff',
		barProgressSelectedColor = '#8282f5',
		barBackgroundColor = '#b8c2cc',
		barBackgroundSelectedColor = '#aeb8c2',
		projectProgressColor = '#7db59a',
		projectProgressSelectedColor = '#59a985',
		projectBackgroundColor = '#fac465',
		projectBackgroundSelectedColor = '#f7bb53',
		milestoneBackgroundColor = '#f1c453',
		milestoneBackgroundSelectedColor = '#f29e4c',
		rtl = false,
		handleWidth = 8,
		timeStep = 300000,
		arrowColor = 'grey',
		fontFamily = 'Arial, Roboto, Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue',
		fontSize = '14px',
		arrowIndent = 20,
		todayColor = 'rgba(252, 248, 227, 0.5)',
		viewDate,
		onDateChange,
		onProgressChange,
		onDoubleClick,
		onClick,
		onDelete,
		onSelect,
		onExpanderClick
	} = props

	const wrapperRef = useRef<HTMLDivElement>(null)
	const taskListRef = useRef<HTMLDivElement>(null)

	const [currentViewDate, setCurrentViewDate] = useState<Date | undefined>(undefined)
	const [taskListWidth, setTaskListWidth] = useState(0)
	const [svgContainerWidth, setSvgContainerWidth] = useState(0)
	const [svgContainerHeight, setSvgContainerHeight] = useState(ganttHeight)
	const [barTasks, setBarTasks] = useState<BarTask[]>([])
	const [ganttEvent, setGanttEvent] = useState<GanttEvent>({ action: '' })
	const [selectedTask, setSelectedTask] = useState<BarTask>()
	const [failedTask, setFailedTask] = useState<BarTask | null>(null)
	const [scrollY, setScrollY] = useState(0)
	const [scrollX, setScrollX] = useState(-1)
	const [ignoreScrollEvent, setIgnoreScrollEvent] = useState(false)

	const [dateSetup, setDateSetup] = useState<DateSetup>(() => {
		const [startDate, endDate] = ganttDateRange(tasks, viewMode, preStepsCount)

		return { viewMode, dates: seedDates(startDate, endDate, viewMode) }
	})

	const svgWidth = dateSetup.dates.length * columnWidth
	const ganttFullHeight = barTasks.length * rowHeight
	const taskHeight = useTaskHeight({ rowHeight, barFill })

	useCurrent({ viewDate, columnWidth, dateSetup, viewMode, currentViewDate, setCurrentViewDate, setScrollX })
	useChangedTask({ ganttEvent, barTasks, setGanttEvent, setBarTasks })
	useFailedTask({ failedTask, barTasks, setBarTasks, setFailedTask })

	useTasks({
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
	})

	useTaskSize({
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
	})

	useWheel({
		ganttHeight,
		rtl,
		wrapperRef,
		svgWidth,
		ganttFullHeight,
		scrollX,
		scrollY,
		setScrollX,
		setScrollY,
		setIgnoreScrollEvent
	})

	const handleScrollX = useMemoizedFn((event: SyntheticEvent<HTMLDivElement>) => {
		if (scrollX !== event.currentTarget.scrollLeft && !ignoreScrollEvent) {
			setScrollX(event.currentTarget.scrollLeft)
			setIgnoreScrollEvent(true)
		} else {
			setIgnoreScrollEvent(false)
		}
	})

	const handleScrollY = useMemoizedFn((event: SyntheticEvent<HTMLDivElement>) => {
		if (scrollY !== event.currentTarget.scrollTop && !ignoreScrollEvent) {
			setScrollY(event.currentTarget.scrollTop)
			setIgnoreScrollEvent(true)
		} else {
			setIgnoreScrollEvent(false)
		}
	})

	const handleKeyDown = useMemoizedFn((event: React.KeyboardEvent<HTMLDivElement>) => {
		event.preventDefault()

		let newScrollY = scrollY
		let newScrollX = scrollX
		let isX = true

		switch (event.key) {
			case 'Down':
			case 'ArrowDown':
				newScrollY += rowHeight
				isX = false
				break
			case 'Up':
			case 'ArrowUp':
				newScrollY -= rowHeight
				isX = false
				break
			case 'Left':
			case 'ArrowLeft':
				newScrollX -= columnWidth
				break
			case 'Right':
			case 'ArrowRight':
				newScrollX += columnWidth
				break
		}

		if (isX) {
			if (newScrollX < 0) {
				newScrollX = 0
			} else if (newScrollX > svgWidth) {
				newScrollX = svgWidth
			}

			setScrollX(newScrollX)
		} else {
			if (newScrollY < 0) {
				newScrollY = 0
			} else if (newScrollY > ganttFullHeight - ganttHeight) {
				newScrollY = ganttFullHeight - ganttHeight
			}

			setScrollY(newScrollY)
		}

		setIgnoreScrollEvent(true)
	})

	const handleSelectedTask = useMemoizedFn((taskId: string) => {
		const newSelectedTask = barTasks.find((t) => t.id === taskId)
		const oldSelectedTask = barTasks.find((t) => !!selectedTask && t.id === selectedTask.id)

		if (onSelect) {
			if (oldSelectedTask) {
				onSelect(oldSelectedTask, false)
			}
			if (newSelectedTask) {
				onSelect(newSelectedTask, true)
			}
		}

		setSelectedTask(newSelectedTask)
	})

	const handleExpanderClick = useMemoizedFn((task: TaskType) => {
		if (onExpanderClick && task.hideChildren !== undefined) {
			onExpanderClick({ ...task, hideChildren: !task.hideChildren })
		}
	})

	const props_task: IPropsTask = {
		gridProps: {
			columnWidth,
			svgWidth,
			tasks: tasks,
			rowHeight,
			dates: dateSetup.dates,
			todayColor,
			rtl
		},
		calendarProps: {
			dateSetup,
			locale,
			viewMode,
			headerHeight,
			columnWidth,
			fontFamily,
			fontSize,
			rtl
		},
		barProps: {
			tasks: barTasks,
			dates: dateSetup.dates,
			ganttEvent,
			selectedTask,
			rowHeight,
			taskHeight,
			columnWidth,
			arrowColor,
			timeStep,
			fontFamily,
			fontSize,
			arrowIndent,
			svgWidth,
			rtl,
			setGanttEvent,
			setFailedTask,
			setSelectedTask: handleSelectedTask,
			onDateChange,
			onProgressChange,
			onDoubleClick,
			onClick,
			onDelete
		},
		ganttHeight,
		scrollY,
		scrollX
	}

	const props_task_list: IPropsTaskList = {
		rowHeight,
		rowWidth: listCellWidth,
		fontFamily,
		fontSize,
		tasks: barTasks,
		locale,
		headerHeight,
		scrollY,
		ganttHeight,
		horizontalContainerClass: styles.horizontalContainer,
		selectedTask,
		taskListRef,
		setSelectedTask: handleSelectedTask,
		onExpanderClick: handleExpanderClick
	}

	const props_tooltip: IPropsTooltip = {
		arrowIndent,
		rowHeight,
		svgContainerHeight,
		svgContainerWidth,
		fontFamily,
		fontSize,
		scrollX,
		scrollY,
		task: ganttEvent.changedTask!,
		headerHeight,
		taskListWidth,
		rtl,
		svgWidth
	}

	const props_vertical_scroll: IPropsVerticalScroll = {
		ganttFullHeight,
		ganttHeight,
		headerHeight,
		scroll: scrollY,
		rtl,
		onScroll: handleScrollY
	}

	const props_horizontal_scroll: IPropsHorizontalScroll = {
		svgWidth,
		taskListWidth,
		scroll: scrollX,
		rtl,
		onScroll: handleScrollX
	}

	return (
		<div>
			<div className={styles.wrapper} onKeyDown={handleKeyDown} tabIndex={0} ref={wrapperRef}>
				{listCellWidth && <TaskList {...props_task_list} />}
				<Task {...props_task} />
				{ganttEvent.changedTask && <Tooltip {...props_tooltip} />}
				<VerticalScroll {...props_vertical_scroll} />
			</div>
			<HorizontalScroll {...props_horizontal_scroll} />
		</div>
	)
}

export default Index
