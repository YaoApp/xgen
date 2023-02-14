import { useMemo } from 'react'

import styles from './index.css'

import type { IPropsMilestone } from '../../types'

const Index = (props: IPropsMilestone) => {
	const { task, isDateChangeable, isSelected, onEventStart } = props

      const color = useMemo(
		() => (isSelected ? task.styles.backgroundSelectedColor : task.styles.backgroundColor),
		[isSelected, task.styles]
	)
	const transform = useMemo(
		() => `rotate(45 ${task.x1 + task.height * 0.356} 
            ${task.y + task.height * 0.85})`,
		[task]
	)

	return (
		<g className={styles._local} tabIndex={0}>
			<rect
				fill={color}
				x={task.x1}
				width={task.height}
				y={task.y}
				height={task.height}
				rx={task.barCornerRadius}
				ry={task.barCornerRadius}
				transform={transform}
				className={styles.milestoneBackground}
				onMouseDown={(e) => isDateChangeable && onEventStart('move', task, e)}
			/>
		</g>
	)
}

export default Index
