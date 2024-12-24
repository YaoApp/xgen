import { FC, useState, useRef } from 'react'
import { Input } from 'antd'
import Icon from '@/widgets/Icon'
import clsx from 'clsx'
import './menu.less'
export interface MenuItem {
	id: string
	name: string
	icon?: string
	image?: string
	link?: string
	children?: MenuItem[]
	hasParent?: boolean
}

interface MenuProps {
	isVisible?: boolean
	activeId?: string
	items: MenuItem[]
	onSelect: (item: MenuItem) => void
	onToggle: (id?: string) => void
}

const MenuItem: FC<{
	item: MenuItem
	level: number
	expanded: { [key: string]: boolean }
	activeId: string
	onToggle: (id?: string) => void
	onSelect: (menu: MenuItem) => void
	searchTerm: string
}> = ({ item, level, expanded, activeId, onToggle, onSelect, searchTerm }) => {
	const hasChildren = item.children && item.children.length > 0
	const isExpanded = expanded[item.id]

	// Check if current item or any of its children are active
	const isActive = (currentItem: MenuItem): boolean => {
		if (currentItem.id === activeId) return true
		if (currentItem.children) {
			return currentItem.children.some((child) => isActive(child))
		}
		return false
	}

	const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase())
	const hasMatchingChildren =
		item.children?.some((child) => child.name.toLowerCase().includes(searchTerm.toLowerCase())) || false

	if (searchTerm && !matchesSearch && !hasMatchingChildren) {
		return null
	}

	return (
		<div className={clsx('menu_item_wrapper', `level-${level}`)}>
			<div
				className={clsx('menu_item', {
					expanded: isExpanded,
					'has-children': hasChildren,
					active: isActive(item)
				})}
				onClick={() => {
					if (item.link) {
						onSelect(item)
					}
					if (hasChildren) {
						onToggle(item.id)
					}
				}}
			>
				<div className='menu_item_content'>
					{item.icon && <Icon name={item.icon} size={16} />}
					{item.image && <img src={item.image} alt={item.name} className='menu_item_image' />}
					<span className='menu_item_name'>{item.name}</span>
				</div>
				{hasChildren && (
					<Icon
						name={isExpanded ? 'material-expand_less' : 'material-expand_more'}
						size={16}
						className={clsx('menu_expand_icon', { active: isActive(item) })}
					/>
				)}
			</div>
			{hasChildren && isExpanded && (
				<div className='menu_children'>
					{item.children?.map((child) => (
						<MenuItem
							key={child.id}
							item={child}
							level={level + 1}
							expanded={expanded}
							activeId={activeId}
							onToggle={onToggle}
							onSelect={onSelect}
							searchTerm={searchTerm}
						/>
					))}
				</div>
			)}
		</div>
	)
}

const Menu: FC<MenuProps> = ({ isVisible = true, onToggle, onSelect, activeId: initialActiveId, items }) => {
	const [expanded, setExpanded] = useState<{ [key: string]: boolean }>({})
	const [searchTerm, setSearchTerm] = useState('')
	const [activeId, setActiveId] = useState(initialActiveId || '')
	const menuRef = useRef<HTMLDivElement>(null)
	const handleToggle = (id?: string) => {
		if (!id) return
		setExpanded((prev) => ({
			...prev,
			[id]: !prev[id]
		}))
	}

	const handleSelect = (item: MenuItem) => {
		setActiveId(item.id)
		onSelect(item)
	}

	return (
		<aside className={clsx('menu_container', { hidden: !isVisible })} ref={menuRef}>
			<div className='menu_search'>
				<Input
					prefix={<Icon name='material-search' size={16} />}
					placeholder='Search menu...'
					value={searchTerm}
					onChange={(e) => setSearchTerm(e.target.value)}
				/>
			</div>
			<div className='menu_items_container'>
				{items.map((item) => (
					<MenuItem
						key={item.id}
						item={item}
						level={0}
						expanded={expanded}
						activeId={activeId}
						onToggle={handleToggle}
						onSelect={handleSelect}
						searchTerm={searchTerm}
					/>
				))}
			</div>
			{/* {isVisible && (
				<button className='menu_toggle menu_toggle_close' onClick={() => onToggle()}>
					<Icon name='material-first_page' size={16} />
				</button>
			)} */}
		</aside>
	)
}

export default Menu
