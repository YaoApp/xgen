import type { BarMoveAction, BarTask } from '@/types'

import { dateByX, moveByX } from './condition'

export const handleTaskBySVGMouseEventForMilestone = (
	svgX: number,
	action: BarMoveAction,
	selectedTask: BarTask,
	xStep: number,
	timeStep: number,
	initEventX1Delta: number
): { isChanged: boolean; changedTask: BarTask } => {
      const changedTask: BarTask = { ...selectedTask }
      
      let isChanged = false
      
	switch (action) {
		case 'move': {
			const [newMoveX1, newMoveX2] = moveByX(svgX - initEventX1Delta, xStep, selectedTask)
			isChanged = newMoveX1 !== selectedTask.x1
			if (isChanged) {
				changedTask.start = dateByX(newMoveX1, selectedTask.x1, selectedTask.start, xStep, timeStep)
				changedTask.end = changedTask.start
				changedTask.x1 = newMoveX1
				changedTask.x2 = newMoveX2
			}
			break
		}
      }
      
	return { isChanged, changedTask }
}
