import { useEffect } from 'react'

import type { BarTask } from '@/types'

interface HookProps {
	failedTask: BarTask | null
	barTasks: Array<BarTask>
	setFailedTask: (v: BarTask | null) => void
	setBarTasks: (v: Array<BarTask>) => void
}

export default (props: HookProps) => {
	const { failedTask, barTasks, setBarTasks, setFailedTask } = props

	useEffect(() => {
		if (failedTask) {
			setBarTasks(barTasks.map((t) => (t.id !== failedTask.id ? t : failedTask)))
			setFailedTask(null)
		}
	}, [failedTask, barTasks])
}
