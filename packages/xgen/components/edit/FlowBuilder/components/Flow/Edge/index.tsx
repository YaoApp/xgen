import clsx from 'clsx'
import { FC } from 'react'
import { EdgeProps, EdgeLabelRenderer, StepEdge, getBezierPath } from 'reactflow'
import styles from './index.less'

const CustomEdge: FC<EdgeProps> = ({
	id,
	source,
	target,
	sourceX,
	sourceY,
	targetX,
	targetY,
	sourcePosition,
	targetPosition,
	data,
	style,
	markerEnd
}) => {
	const [edgePath, labelX, labelY] = getBezierPath({
		sourceX,
		sourceY,
		sourcePosition,
		targetX,
		targetY,
		targetPosition
	})

	return (
		<>
			<StepEdge
				id={id}
				sourceX={sourceX}
				sourceY={sourceY}
				targetX={targetX}
				targetY={targetY}
				sourcePosition={sourcePosition}
				targetPosition={targetPosition}
				style={style}
				markerEnd={markerEnd}
				source={source}
				target={target}
				data={data}
			/>

			<EdgeLabelRenderer>
				{data?.label != '' && data?.label != undefined && (
					<div className={clsx(styles._local)}>
						<a
							style={{
								transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`
							}}
							className='label nodrag nopan'
						>
							{data.label}
						</a>
					</div>
				)}
			</EdgeLabelRenderer>
		</>
	)
}

export default CustomEdge
