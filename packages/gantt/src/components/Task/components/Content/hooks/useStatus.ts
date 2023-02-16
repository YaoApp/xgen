import { useEffect } from 'react'

import { handleTaskBySVGMouseEvent } from '@/utils'

import useXStep from './useXStep'

import type { IPropsContent } from '../../../types'
import type { BarMoveAction } from '@/types'

interface HookProps
	extends Pick<
		IPropsContent,
		| 'columnWidth'
		| 'dates'
		| 'ganttEvent'
		| 'timeStep'
		| 'svg'
		| 'rtl'
		| 'onDateChange'
		| 'onProgressChange'
		| 'setGanttEvent'
		| 'setFailedTask'
	> {
	point: DOMPoint | undefined
	initEventX1Delta: number
	isMoving: boolean
	setIsMoving: (v: boolean) => void
}

export default (props: HookProps) => {
	const {
		columnWidth,
		dates,
		ganttEvent,
		timeStep,
		svg,
		rtl,
		isMoving,
		point,
		initEventX1Delta,
		onDateChange,
		onProgressChange,
		setGanttEvent,
		setFailedTask,
		setIsMoving
	} = props
	const xStep = useXStep({ columnWidth, dates, timeStep })

	useEffect(() => {
		const handleMouseMove = async (event: MouseEvent) => {
			if (!ganttEvent.changedTask || !point || !svg?.current) return

			event.preventDefault()

			point.x = event.clientX

			const cursor = point.matrixTransform(svg?.current.getScreenCTM()?.inverse())

			const { isChanged, changedTask } = handleTaskBySVGMouseEvent(
				cursor.x,
				ganttEvent.action as BarMoveAction,
				ganttEvent.changedTask,
				xStep,
				timeStep,
				initEventX1Delta,
				rtl
			)

			if (isChanged) setGanttEvent({ action: ganttEvent.action, changedTask })
		}

		const handleMouseUp = async (event: MouseEvent) => {
			const { action, originalSelectedTask, changedTask } = ganttEvent
			if (!changedTask || !point || !svg?.current || !originalSelectedTask) return
			event.preventDefault()

			point.x = event.clientX
			const cursor = point.matrixTransform(svg?.current.getScreenCTM()?.inverse())
			const { changedTask: newChangedTask } = handleTaskBySVGMouseEvent(
				cursor.x,
				action as BarMoveAction,
				changedTask,
				xStep,
				timeStep,
				initEventX1Delta,
				rtl
			)

			const isNotLikeOriginal =
				originalSelectedTask.start !== newChangedTask.start ||
				originalSelectedTask.end !== newChangedTask.end ||
				originalSelectedTask.progress !== newChangedTask.progress

			svg.current.removeEventListener('mousemove', handleMouseMove)
			svg.current.removeEventListener('mouseup', handleMouseUp)

			setGanttEvent({ action: '' })
			setIsMoving(false)

			let operationSuccess = true

			if (
				(action === 'move' || action === 'end' || action === 'start') &&
				onDateChange &&
				isNotLikeOriginal
			) {
				try {
					const result = await onDateChange(newChangedTask, newChangedTask.barChildren)

					if (result !== undefined) operationSuccess = result
				} catch (error) {
					operationSuccess = false
				}
			} else if (onProgressChange && isNotLikeOriginal) {
				try {
					const result = await onProgressChange(newChangedTask, newChangedTask.barChildren)

					if (result !== undefined) operationSuccess = result
				} catch (error) {
					operationSuccess = false
				}
			}

			if (!operationSuccess) setFailedTask(originalSelectedTask)
		}

		if (
			!isMoving &&
			(ganttEvent.action === 'move' ||
				ganttEvent.action === 'end' ||
				ganttEvent.action === 'start' ||
				ganttEvent.action === 'progress') &&
			svg?.current
		) {
			svg.current.addEventListener('mousemove', handleMouseMove)
			svg.current.addEventListener('mouseup', handleMouseUp)

			setIsMoving(true)
		}
	}, [ganttEvent, xStep, initEventX1Delta, timeStep, svg, isMoving, point, rtl])
}
