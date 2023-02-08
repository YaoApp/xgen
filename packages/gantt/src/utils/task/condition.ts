import type { BarTask } from '@/types'

export const startByX = (x: number, xStep: number, task: BarTask) => {
	if (x >= task.x2 - task.handleWidth * 2) {
		x = task.x2 - task.handleWidth * 2
	}

	const steps = Math.round((x - task.x1) / xStep)
	const additionalXValue = steps * xStep
	const newX = task.x1 + additionalXValue

	return newX
}

export const endByX = (x: number, xStep: number, task: BarTask) => {
	if (x <= task.x1 + task.handleWidth * 2) {
		x = task.x1 + task.handleWidth * 2
	}

	const steps = Math.round((x - task.x2) / xStep)
	const additionalXValue = steps * xStep
	const newX = task.x2 + additionalXValue

	return newX
}

export const moveByX = (x: number, xStep: number, task: BarTask) => {
	const steps = Math.round((x - task.x1) / xStep)
	const additionalXValue = steps * xStep
	const newX1 = task.x1 + additionalXValue
	const newX2 = newX1 + task.x2 - task.x1

	return [newX1, newX2]
}

export const dateByX = (x: number, taskX: number, taskDate: Date, xStep: number, timeStep: number) => {
	let newDate = new Date(((x - taskX) / xStep) * timeStep + taskDate.getTime())

	newDate = new Date(newDate.getTime() + (newDate.getTimezoneOffset() - taskDate.getTimezoneOffset()) * 60000)

	return newDate
}
