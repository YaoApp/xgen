import { useMemo } from 'react'

import type { IPropsDisplay } from '../types'

const Index = (props: IPropsDisplay) => {
	const { x, y, width, height, isSelected, progressX, progressWidth, barCornerRadius, styles, onMouseDown } = props

	const { barColor, processColor } = useMemo(() => {
		return {
			barColor: isSelected ? styles.progressSelectedColor : styles.progressColor,
			processColor: isSelected ? styles.backgroundSelectedColor : styles.backgroundColor
		}
	}, [isSelected, styles])

	return (
		<g onMouseDown={onMouseDown}>
			<rect
				className='barBackground'
				x={x}
				y={y}
				width={width}
				height={height}
				ry={barCornerRadius}
				rx={barCornerRadius}
				fill={barColor}
			/>
			<rect
				x={progressX}
				y={y}
				width={progressWidth}
				height={height}
				ry={barCornerRadius}
				rx={barCornerRadius}
				fill={processColor}
			/>
		</g>
	)
}

export default Index
