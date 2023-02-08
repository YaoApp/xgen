import { BarMoveAction, BarTask } from '@/types'

import { dateByX, endByX, moveByX, startByX } from './condition'
import { progressByX, progressByXRTL, progressWithByParams } from './progress'

export const handleTaskBySVGMouseEventForBar = (
	svgX: number,
	action: BarMoveAction,
	selectedTask: BarTask,
	xStep: number,
	timeStep: number,
	initEventX1Delta: number,
	rtl: boolean
): { isChanged: boolean; changedTask: BarTask } => {
	const changedTask: BarTask = { ...selectedTask }

	let isChanged = false

	switch (action) {
		case 'progress':
			if (rtl) {
				changedTask.progress = progressByXRTL(svgX, selectedTask)
			} else {
				changedTask.progress = progressByX(svgX, selectedTask)
			}

			isChanged = changedTask.progress !== selectedTask.progress

			if (isChanged) {
				const [progressWidth, progressX] = progressWithByParams(
					changedTask.x1,
					changedTask.x2,
					changedTask.progress,
					rtl
				)

				changedTask.progressWidth = progressWidth
				changedTask.progressX = progressX
			}

			break
		case 'start': {
			const newX1 = startByX(svgX, xStep, selectedTask)

			changedTask.x1 = newX1
			isChanged = changedTask.x1 !== selectedTask.x1

			if (isChanged) {
				if (rtl) {
					changedTask.end = dateByX(newX1, selectedTask.x1, selectedTask.end, xStep, timeStep)
				} else {
					changedTask.start = dateByX(newX1, selectedTask.x1, selectedTask.start, xStep, timeStep)
				}

				const [progressWidth, progressX] = progressWithByParams(
					changedTask.x1,
					changedTask.x2,
					changedTask.progress,
					rtl
				)

				changedTask.progressWidth = progressWidth
				changedTask.progressX = progressX
			}

			break
		}
		case 'end': {
			const newX2 = endByX(svgX, xStep, selectedTask)

			changedTask.x2 = newX2
			isChanged = changedTask.x2 !== selectedTask.x2

			if (isChanged) {
				if (rtl) {
					changedTask.start = dateByX(newX2, selectedTask.x2, selectedTask.start, xStep, timeStep)
				} else {
					changedTask.end = dateByX(newX2, selectedTask.x2, selectedTask.end, xStep, timeStep)
				}

				const [progressWidth, progressX] = progressWithByParams(
					changedTask.x1,
					changedTask.x2,
					changedTask.progress,
					rtl
				)

				changedTask.progressWidth = progressWidth
				changedTask.progressX = progressX
			}

			break
		}
		case 'move': {
			const [newMoveX1, newMoveX2] = moveByX(svgX - initEventX1Delta, xStep, selectedTask)

			isChanged = newMoveX1 !== selectedTask.x1

			if (isChanged) {
				changedTask.start = dateByX(newMoveX1, selectedTask.x1, selectedTask.start, xStep, timeStep)
				changedTask.end = dateByX(newMoveX2, selectedTask.x2, selectedTask.end, xStep, timeStep)
				changedTask.x1 = newMoveX1
				changedTask.x2 = newMoveX2

				const [progressWidth, progressX] = progressWithByParams(
					changedTask.x1,
					changedTask.x2,
					changedTask.progress,
					rtl
				)

				changedTask.progressWidth = progressWidth
				changedTask.progressX = progressX
			}

			break
		}
	}

	return { isChanged, changedTask }
}
