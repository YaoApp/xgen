import { useMemo } from 'react'

import styles from './index.css'

import type { IPropsProject } from '../../types'

const Index = (props: IPropsProject) => {
	const { task, isSelected } = props

	const { barColor, processColor } = useMemo(() => {
		return {
			barColor: isSelected ? task.styles.backgroundSelectedColor : task.styles.backgroundColor,
			processColor: isSelected ? task.styles.progressSelectedColor : task.styles.progressColor
		}
	}, [task.styles])

	const { projectWith, projectLeftTriangle, projectRightTriangle } = useMemo(() => {
		return {
			projectWith: task.x2 - task.x1,
			projectLeftTriangle: [
				task.x1,
				task.y + task.height / 2 - 1,
				task.x1,
				task.y + task.height,
				task.x1 + 15,
				task.y + task.height / 2 - 1
			].join(','),
			projectRightTriangle: [
				task.x2,
				task.y + task.height / 2 - 1,
				task.x2,
				task.y + task.height,
				task.x2 - 15,
				task.y + task.height / 2 - 1
			].join(',')
		}
	}, [task])

	return (
		<g tabIndex={0} className={styles._local}>
			<rect
				className='projectBackground'
				fill={barColor}
				x={task.x1}
				width={projectWith}
				y={task.y}
				height={task.height}
				rx={task.barCornerRadius}
				ry={task.barCornerRadius}
			/>
			<rect
				x={task.progressX}
				width={task.progressWidth}
				y={task.y}
				height={task.height}
				ry={task.barCornerRadius}
				rx={task.barCornerRadius}
				fill={processColor}
			/>
			<rect
				className='projectTop'
				fill={barColor}
				x={task.x1}
				width={projectWith}
				y={task.y}
				height={task.height / 2}
				rx={task.barCornerRadius}
				ry={task.barCornerRadius}
			/>
			<polygon className='projectTop' points={projectLeftTriangle} fill={barColor} />
			<polygon className='projectTop' points={projectRightTriangle} fill={barColor} />
		</g>
	)
}

export default Index
