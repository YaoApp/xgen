import type { BarTask } from '@/types'

export const progressWithByParams = (taskX1: number, taskX2: number, progress: number, rtl: boolean) => {
	const progressWidth = (taskX2 - taskX1) * progress * 0.01
	let progressX: number
	if (rtl) {
		progressX = taskX2 - progressWidth
	} else {
		progressX = taskX1
	}
	return [progressWidth, progressX]
}

export const progressByProgressWidth = (progressWidth: number, barTask: BarTask) => {
	const barWidth = barTask.x2 - barTask.x1
	const progressPercent = Math.round((progressWidth * 100) / barWidth)
	if (progressPercent >= 100) return 100
	else if (progressPercent <= 0) return 0
	else return progressPercent
}

export const progressByX = (x: number, task: BarTask) => {
	if (x >= task.x2) return 100
	else if (x <= task.x1) return 0
	else {
		const barWidth = task.x2 - task.x1
		const progressPercent = Math.round(((x - task.x1) * 100) / barWidth)
		return progressPercent
	}
}

export const progressByXRTL = (x: number, task: BarTask) => {
	if (x >= task.x2) return 0
	else if (x <= task.x1) return 100
	else {
		const barWidth = task.x2 - task.x1
		const progressPercent = Math.round(((task.x2 - x) * 100) / barWidth)
		return progressPercent
	}
}

export const getProgressPoint = (progressX: number, taskY: number, taskHeight: number) => {
	const point = [
		progressX - 5,
		taskY + taskHeight,
		progressX + 5,
		taskY + taskHeight,
		progressX,
		taskY + taskHeight - 8.66
      ]
      
	return point.join(',')
}
