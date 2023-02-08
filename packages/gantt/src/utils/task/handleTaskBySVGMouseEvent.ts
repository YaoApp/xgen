import type { BarMoveAction, BarTask } from '@/types'

import { handleTaskBySVGMouseEventForBar } from './handleTaskBySVGMouseEventForBar'
import { handleTaskBySVGMouseEventForMilestone } from './handleTaskBySVGMouseEventForMilestone'

export const handleTaskBySVGMouseEvent = (
	svgX: number,
	action: BarMoveAction,
	selectedTask: BarTask,
	xStep: number,
	timeStep: number,
	initEventX1Delta: number,
	rtl: boolean
): { isChanged: boolean; changedTask: BarTask } => {
      let result: { isChanged: boolean; changedTask: BarTask }
      
	switch (selectedTask.type) {
		case 'milestone':
			result = handleTaskBySVGMouseEventForMilestone(
				svgX,
				action,
				selectedTask,
				xStep,
				timeStep,
				initEventX1Delta
			)
			break
		default:
			result = handleTaskBySVGMouseEventForBar(
				svgX,
				action,
				selectedTask,
				xStep,
				timeStep,
				initEventX1Delta,
				rtl
			)
			break
      }
      
	return result
}
