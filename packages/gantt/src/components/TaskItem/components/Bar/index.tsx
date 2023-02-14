import { useMemo } from 'react'

import { getProgressPoint } from '@/utils'

import { Date, Display, Progress } from './components'
import styles from './index.css'

import type { IPropsBar } from '../../types'

const Index = (props: IPropsBar) => {
	const { task, isProgressChangeable, isDateChangeable, rtl, isSelected, onEventStart } = props

	const handleHeight = useMemo(() => task.height - 2, [task.height])
	const progressPoint = useMemo(
		() => getProgressPoint(+!rtl * task.progressWidth + task.progressX, task.y, task.height),
		[rtl, task]
	)

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
				{isDateChangeable && (
					<g>
						<Date
							x={task.x1 + 1}
							y={task.y + 1}
							width={task.handleWidth}
							height={handleHeight}
							barCornerRadius={task.barCornerRadius}
							onMouseDown={(e) => onEventStart('start', task, e)}
						/>
						<Date
							x={task.x2 - task.handleWidth - 1}
							y={task.y + 1}
							width={task.handleWidth}
							height={handleHeight}
							barCornerRadius={task.barCornerRadius}
							onMouseDown={(e) => onEventStart('end', task, e)}
						/>
					</g>
				)}
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
