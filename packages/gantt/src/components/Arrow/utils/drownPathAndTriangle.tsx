import type { IPropsArrow } from '../types'

interface UtilProps extends Omit<IPropsArrow, 'rtl'> {}

export default (props: UtilProps) => {
	const { taskFrom, taskTo, rowHeight, taskHeight, arrowIndent } = props

	const indexCompare = taskFrom.index > taskTo.index ? -1 : 1
	const taskToEndPosition = taskTo.y + taskHeight / 2
	const taskFromEndPosition = taskFrom.x2 + arrowIndent * 2
	const taskFromHorizontalOffsetValue = taskFromEndPosition < taskTo.x1 ? '' : `H ${taskTo.x1 - arrowIndent}`
	const taskToHorizontalOffsetValue =
		taskFromEndPosition > taskTo.x1 ? arrowIndent : taskTo.x1 - taskFrom.x2 - arrowIndent

	const path = `
            M ${taskFrom.x2} ${taskFrom.y + taskHeight / 2} 
            h ${arrowIndent} 
            v ${(indexCompare * rowHeight) / 2} 
            ${taskFromHorizontalOffsetValue}
            V ${taskToEndPosition} 
            h ${taskToHorizontalOffsetValue}
            `

	const trianglePoints = `
            ${taskTo.x1},${taskToEndPosition} 
            ${taskTo.x1 - 5},${taskToEndPosition - 5} 
            ${taskTo.x1 - 5},${taskToEndPosition + 5}
            `
	return [path, trianglePoints]
}
