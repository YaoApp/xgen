import type { IPropsArrow } from '../types'

interface UtilProps extends Omit<IPropsArrow, 'rtl'> {}

export default (props: UtilProps) => {
	const { taskFrom, taskTo, rowHeight, taskHeight, arrowIndent } = props

	const indexCompare = taskFrom.index > taskTo.index ? -1 : 1
	const taskToEndPosition = taskTo.y + taskHeight / 2
	const taskFromEndPosition = taskFrom.x1 - arrowIndent * 2
	const taskFromHorizontalOffsetValue = taskFromEndPosition > taskTo.x2 ? '' : `H ${taskTo.x2 + arrowIndent}`
	const taskToHorizontalOffsetValue =
		taskFromEndPosition < taskTo.x2 ? -arrowIndent : taskTo.x2 - taskFrom.x1 + arrowIndent

	const path = `
            M ${taskFrom.x1} ${taskFrom.y + taskHeight / 2} 
            h ${-arrowIndent} 
            v ${(indexCompare * rowHeight) / 2} 
            ${taskFromHorizontalOffsetValue}
            V ${taskToEndPosition} 
            h ${taskToHorizontalOffsetValue}
      `

	const trianglePoints = `
            ${taskTo.x2},${taskToEndPosition} 
            ${taskTo.x2 + 5},${taskToEndPosition + 5} 
            ${taskTo.x2 + 5},${taskToEndPosition - 5}
      `

	return [path, trianglePoints]
}
