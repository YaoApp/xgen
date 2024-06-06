import { Icon } from '@/widgets'
import { IconName, IconSize } from '../../utils'
import { useBuilderContext } from '../Builder/Provider'
import { useGlobal } from '@/context/app'
import { Color } from '@/utils'

interface IProps {
	height?: number
	visible?: boolean
	toggleSidebar: () => void
}

const Index = (props: IProps) => {
	const className = 'sidebar' + (!props.visible ? ' collapsed' : '')
	const { setting } = useBuilderContext()
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
					className='content'
					style={{ maxHeight: props.height, minHeight: props.height, height: props.height }}
				>
					{setting?.types?.map((type, index) => (
						<div
							key={`${type.name}|${index}`}
							className='item'
							draggable={true}
							unselectable='on'
							onDragStart={(e) =>
								e.dataTransfer.setData('application/reactflow', type.name)
							}
						>
							<Icon
								size={IconSize(type.icon, 14)}
								name={IconName(type.icon)}
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
	)
}

export default window.$app.memo(Index)
