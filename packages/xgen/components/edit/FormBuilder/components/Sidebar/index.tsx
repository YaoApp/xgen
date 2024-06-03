import { Icon } from '@/widgets'
import { Type } from '../../types'
import { useEffect, useState } from 'react'

interface IProps {
	types?: Type[]
	height?: number
	fixed: boolean
	offsetTop: number
	showSidebar: boolean
	fullscreen: boolean
}

const Index = (props: IProps) => {
	const className = 'sidebar' + (!props.showSidebar ? ' collapsed' : '')

	return (
		<div className={className}>
			<div
				style={{
					maxHeight: props.height,
					minHeight: props.height,
					zIndex: 99,
					width: 200
				}}
			>
				<div className='content' style={{ width: 200, zIndex: 99 }}>
					{props.types?.map((type, index) => (
						<div
							key={`${type.name}|${index}`}
							className='item'
							draggable={true}
							unselectable='on'
							onDragStart={(e) =>
								e.dataTransfer.setData(
									'text/plain',
									JSON.stringify({ type: type.name })
								)
							}
						>
							<Icon
								size={14}
								name={
									type.icon
										? typeof type.icon == 'string'
											? type.icon
											: type.icon.name
										: 'material-format_align_left'
								}
								color={type.color}
								className='mr_6'
							/>
							{type.label ? type.label : type.name}
						</div>
					))}
				</div>
			</div>
		</div>
	)
}

export default window.$app.memo(Index)
