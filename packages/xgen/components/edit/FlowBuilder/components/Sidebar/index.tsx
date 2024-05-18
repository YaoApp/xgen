import { Icon } from '@/widgets'
import { IconName, IconSize } from '../../utils'
import { useBuilderContext } from '../Builder/Provider'

interface IProps {
	height?: number
	visible?: boolean
}

const Index = (props: IProps) => {
	const className = 'sidebar' + (!props.visible ? ' collapsed' : '')
	const { setting } = useBuilderContext()
	return (
		<div className={className}>
			<div className='content' style={{ maxHeight: props.height, minHeight: props.height }}>
				{setting?.types?.map((type, index) => (
					<div
						key={`${type.name}|${index}`}
						className='item'
						draggable={true}
						unselectable='on'
						onDragStart={(e) => e.dataTransfer.setData('application/reactflow', type.name)}
					>
						<Icon
							size={IconSize(type.icon, 14)}
							name={IconName(type.icon)}
							color={type.color}
							className='mr_6'
						/>
						{type.label ? type.label : type.name}
					</div>
				))}
			</div>
		</div>
	)
}

export default window.$app.memo(Index)
