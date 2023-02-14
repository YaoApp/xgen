import type { IPropsDate } from '../types'

const Index = (props: IPropsDate) => {
	const { x, y, width, height, barCornerRadius, onMouseDown } = props

	return (
		<rect
			className='barHandle'
			x={x}
			y={y}
			width={width}
			height={height}
			ry={barCornerRadius}
			rx={barCornerRadius}
			onMouseDown={onMouseDown}
		/>
	)
}

export default Index
