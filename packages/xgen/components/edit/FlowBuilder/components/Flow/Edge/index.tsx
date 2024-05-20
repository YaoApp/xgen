import clsx from 'clsx'
import { FC } from 'react'
import { EdgeProps, EdgeLabelRenderer, StepEdge } from 'reactflow'
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
				{data.label != '' && data.label != undefined && (
					<div className={clsx(styles._local)}>
						<a
							style={{
								transform: `translate(-50%, -50%) translate(${targetX - 60}px,${
									targetY - 20
								}px)`
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
