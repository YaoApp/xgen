import { useState } from 'react'

import Arrow from '@/components/Arrow'
import TaskItem from '@/components/TaskItem'

import { useHandleBarEventStart, useStatus } from './hooks'

import type { IPropsContent } from '../../types'

const Index = (props: IPropsContent) => {
	const {
		tasks,
		dates,
		ganttEvent,
		selectedTask,
		rowHeight,
		columnWidth,
		timeStep,
		svg,
		taskHeight,
		arrowColor,
		arrowIndent,
		fontFamily,
		fontSize,
		rtl,
		onDateChange,
		onProgressChange,
		onDoubleClick,
		onClick,
		onDelete,
		setGanttEvent,
		setFailedTask,
		setSelectedTask
	} = props

	const point = svg?.current?.createSVGPoint()
	const [initEventX1Delta, setInitEventX1Delta] = useState(0)
	const [isMoving, setIsMoving] = useState(false)

	useStatus({
		columnWidth,
		dates,
		ganttEvent,
		timeStep,
		svg,
		rtl,
		point,
		initEventX1Delta,
		isMoving,
		onDateChange,
		onProgressChange,
		setGanttEvent,
		setFailedTask,
		setIsMoving
	})

	const handleBarEventStart = useHandleBarEventStart({
		svg,
		ganttEvent,
		point,
		onDoubleClick,
		onClick,
		onDelete,
		setGanttEvent,
		setSelectedTask,
		setInitEventX1Delta
	})

	return (
		<g className='content'>
			<g className='arrows' fill={arrowColor} stroke={arrowColor}>
				{tasks.map((task) => {
					return task.barChildren.map((child) => {
						return (
							<Arrow
								key={`Arrow from ${task.id} to ${tasks[child.index].id}`}
								taskFrom={task}
								taskTo={tasks[child.index]}
								rowHeight={rowHeight}
								taskHeight={taskHeight}
								arrowIndent={arrowIndent}
								rtl={rtl}
							/>
						)
					})
				})}
			</g>
			<g className='bar' fontFamily={fontFamily} fontSize={fontSize}>
				{tasks.map((task) => {
					return (
						<TaskItem
							task={task}
							arrowIndent={arrowIndent}
							taskHeight={taskHeight}
							isProgressChangeable={!!onProgressChange && !task.isDisabled}
							isDateChangeable={!!onDateChange && !task.isDisabled}
							isDelete={!task.isDisabled}
							isSelected={!!selectedTask && task.id === selectedTask.id}
							rtl={rtl}
							key={task.id}
							onEventStart={handleBarEventStart}
						/>
					)
				})}
			</g>
		</g>
	)
}

export default Index
