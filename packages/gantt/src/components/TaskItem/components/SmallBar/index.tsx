import { useMemo } from 'react'

import { getProgressPoint } from '@/utils'

import { Display, Progress } from '../Bar/components'
import styles from '../Bar/index.css'

import type { IPropsSmallBar } from '../../types'

const Index = (props: IPropsSmallBar) => {
	const { task, isProgressChangeable, isDateChangeable, isSelected, onEventStart } = props

	const progressPoint = useMemo(() => getProgressPoint(task.progressWidth + task.x1, task.y, task.height), [task])

	return (
		<g className={styles._local} tabIndex={0}>
			<Display
				x={task.x1}
				y={task.y}
				width={task.x2 - task.x1}
				height={task.height}
				progressX={task.progressX}
				progressWidth={task.progressWidth}
				barCornerRadius={task.barCornerRadius}
				styles={task.styles}
				isSelected={isSelected}
				onMouseDown={(e) => isDateChangeable && onEventStart('move', task, e)}
			/>
			<g className='handleGroup'>
				{isProgressChangeable && (
					<Progress
						progressPoint={progressPoint}
						onMouseDown={(e) => onEventStart('progress', task, e)}
					/>
				)}
			</g>
		</g>
	)
}

export default Index
