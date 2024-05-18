import { Icon } from '@/widgets'
import { Type } from '../../../types'
import { IconName, IconSize } from '../../../utils'
import { Dropdown, MenuProps } from 'antd'
import { useEffect, useState } from 'react'
import { useBuilderContext } from '../../Builder/Provider'

interface IProps {
	onAdd?: (type: string) => void
}

const Index = (props: IProps) => {
	const { hideContextMenu, setHideContextMenu, setting } = useBuilderContext()
	const [open, setOpen] = useState(false)

	useEffect(() => {
		if (hideContextMenu === undefined) return
		hideContextMenu === true && setOpen(false)
	}, [hideContextMenu])

	const onClick = () => {
		setHideContextMenu && setHideContextMenu(false)
		setOpen(true)
	}

	const onMenuClick: MenuProps['onClick'] = (e) => {
		setOpen(false)
		setHideContextMenu && setHideContextMenu(true)
	}

	const items = setting?.types?.map((type, index) => {
		return {
			key: `${type.name}|${index}`,
			label: (
				<div
					key={`${type.name}|${index}`}
					className='item'
					onClick={() => {
						props.onAdd && props.onAdd(type.name)
					}}
				>
					<Icon
						size={IconSize(type.icon, 14)}
						name={IconName(type.icon)}
						color={type.color}
						className='mr_6'
					/>
					{type.label ? type.label : type.name}
				</div>
			)
		}
	})

	return (
		<Dropdown menu={{ items, onClick: onMenuClick }} open={open}>
			<a className='item' onClick={onClick}>
				<Icon name='material-add' size={16} />
			</a>
		</Dropdown>
	)
}

export default window.$app.memo(Index)
