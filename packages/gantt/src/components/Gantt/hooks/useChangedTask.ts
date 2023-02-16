import { useEffect } from 'react'

import type { BarTask, GanttEvent } from '@/types'

interface HookProps {
	ganttEvent: GanttEvent
	barTasks: Array<BarTask>
	setGanttEvent: (v: GanttEvent) => void
	setBarTasks: (v: Array<BarTask>) => void
}

export default (props: HookProps) => {
	const { ganttEvent, barTasks, setGanttEvent, setBarTasks } = props

	useEffect(() => {
		const { changedTask, action } = ganttEvent

		if (changedTask) {
			if (action === 'delete') {
				setGanttEvent({ action: '' })
				setBarTasks(barTasks.filter((t) => t.id !== changedTask.id))
			} else if (action === 'move' || action === 'end' || action === 'start' || action === 'progress') {
				const prevStateTask = barTasks.find((t) => t.id === changedTask.id)

				if (
					prevStateTask &&
					(prevStateTask.start.getTime() !== changedTask.start.getTime() ||
						prevStateTask.end.getTime() !== changedTask.end.getTime() ||
						prevStateTask.progress !== changedTask.progress)
				) {
					const newTaskList = barTasks.map((t) => (t.id === changedTask.id ? changedTask : t))

					setBarTasks(newTaskList)
				}
			}
		}
	}, [ganttEvent, barTasks])
}
