import { Icon } from '@/widgets'
import { Type } from '../../types'
import { useGlobal } from '@/context/app'
import { Color } from '@/utils'

interface IProps {
	types?: Type[]
	height?: number
	fixed: boolean
	offsetTop: number
	visible?: boolean
	toggleSidebar: () => void
	fullscreen: boolean
}

const Index = (props: IProps) => {
	const className = 'sidebar' + (!props.visible ? ' collapsed' : '')
	// Get the text color
	const global = useGlobal()
	const TextColor = (color?: string) => {
		return color && color != '' ? Color(color, global.theme) : Color('text', global.theme)
	}

	return (
		<div className='relative'>
			<a
				onClick={props.toggleSidebar}
				className='toggle-sidebar'
				style={{ top: (props.height || 300 - 32) / 2 }}
			>
				<Icon name={props.visible ? 'material-first_page' : 'material-last_page'} size={14} />
			</a>
			<div className={className}>
				<div
					style={{
						zIndex: 99,
						minHeight: props.height || 300,
						height: (props.height || 300) + (props.fullscreen ? 42 : 60)
					}}
				>
					<div className='content' style={{ zIndex: 99 }}>
						{props.types?.map((type, index) => (
							<div
								key={`${type.name}|${index}`}
								className='item'
								draggable={true}
								unselectable='on'
								onDragStart={(e) =>
									e.dataTransfer.setData(
										'application/form/type',
										JSON.stringify({
											type: type.name,
											width: type.width || 4,
											resizable: type.resizable
										})
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
								<span className='label' style={{ color: TextColor(type.color) }}>
									{type.label ? type.label : type.name}
								</span>
							</div>
						))}
					</div>
				</div>
			</div>
		</div>
	)
}

export default window.$app.memo(Index)
