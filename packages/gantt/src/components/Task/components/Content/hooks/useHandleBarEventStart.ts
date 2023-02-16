import { useMemoizedFn } from 'ahooks'

import { isKeyboardEvent } from '@/utils'

import type { IPropsContent } from '../../../types'
import type { GanttContentMoveAction, BarTask } from '@/types'

interface HookProps
	extends Pick<
		IPropsContent,
		'svg' | 'ganttEvent' | 'onDoubleClick' | 'onClick' | 'onDelete' | 'setGanttEvent' | 'setSelectedTask'
	> {
	point: DOMPoint | undefined
	setInitEventX1Delta: (v: number) => void
}

export default (props: HookProps) => {
	const {
		svg,
		ganttEvent,
		point,
		onDoubleClick,
		onClick,
		onDelete,
		setGanttEvent,
		setSelectedTask,
		setInitEventX1Delta
	} = props

	return useMemoizedFn(
		async (action: GanttContentMoveAction, task: BarTask, event?: React.MouseEvent | React.KeyboardEvent) => {
			if (!event) {
				if (action === 'select') setSelectedTask(task.id)
			} else if (isKeyboardEvent(event)) {
				if (action === 'delete') {
					if (onDelete) {
						try {
							const result = await onDelete(task)
							if (result !== undefined && result) {
								setGanttEvent({ action, changedTask: task })
							}
						} catch (error) {
							console.error('Error on Delete. ' + error)
						}
					}
				}
			} else if (action === 'mouseenter') {
				if (!ganttEvent.action) {
					setGanttEvent({
						action,
						changedTask: task,
						originalSelectedTask: task
					})
				}
			} else if (action === 'mouseleave') {
				if (ganttEvent.action === 'mouseenter') setGanttEvent({ action: '' })
			} else if (action === 'dblclick') {
				!!onDoubleClick && onDoubleClick(task)
			} else if (action === 'click') {
				!!onClick && onClick(task)
			} else if (action === 'move') {
				if (!svg?.current || !point) return

				point.x = event.clientX

				const cursor = point.matrixTransform(svg.current.getScreenCTM()?.inverse())

				setInitEventX1Delta(cursor.x - task.x1)

				setGanttEvent({
					action,
					changedTask: task,
					originalSelectedTask: task
				})
			} else {
				setGanttEvent({
					action,
					changedTask: task,
					originalSelectedTask: task
				})
			}
		}
	)
}
