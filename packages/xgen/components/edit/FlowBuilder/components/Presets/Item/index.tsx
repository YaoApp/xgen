import { Icon } from '@/widgets'
import { IconName, IconSize } from '../../../utils'
import { useBuilderContext } from '../../Builder/Provider'
import { Input, Image, Popover } from 'antd'
import styles from './index.less'
import clsx from 'clsx'
import { PresetItem } from '../../../types'
import { Else, If, Then } from 'react-if'

interface IProps {
	item: PresetItem
}

const Index = (props: IProps) => {
	const { is_cn, setting } = useBuilderContext()
	const it = props.item
	return (
		<div
			className={clsx([styles._local])}
			style={{ gridColumn: `span ${it.width || 6}` }}
			draggable
			unselectable='on'
			onDragStart={(e) => e.dataTransfer.setData('application/reactflow/preset', JSON.stringify(it))}
		>
			<Popover content={it.description} placement='topLeft' className='popover'>
				<div className='item'>
					<If condition={it.cover !== undefined}>
						<Then>
							<div className='cover' style={{ backgroundImage: `url(${it.cover})` }}></div>
						</Then>
						<Else>
							<div className='icon'>
								<If condition={it.image !== undefined}>
									<Then>
										<Image
											preview={false}
											src={it.image}
											width={52}
											height={52}
											style={{ borderRadius: 'var(--radius)' }}
										/>
									</Then>
									<Else>
										<Icon
											name={IconName(it.icon)}
											size={IconSize(it.icon, 24)}
										/>
									</Else>
								</If>
							</div>
							<div className='intro'>
								<div className='name'>{it.name}</div>
								<div className='description'>{it.description}</div>
							</div>
						</Else>
					</If>
				</div>
			</Popover>
		</div>
	)
}

export default window.$app.memo(Index)
