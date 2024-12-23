import { FC, useState, useEffect, useRef } from 'react'
import { Input } from 'antd'
import Icon from '@/widgets/Icon'
import clsx from 'clsx'
import './styles.css'

interface MenuItem {
	id: string
	name: string
	icon?: string
	image?: string
	link?: string
	children?: MenuItem[]
}

interface MenuProps {
	isVisible?: boolean
	onToggle?: () => void
}

// Test data with 3 levels and 30+ items
const testMenuItems: MenuItem[] = [
	{
		id: '1',
		name: 'Dashboard',
		icon: 'material-dashboard',
		link: '/dashboard',
		children: [
			{
				id: '1-1',
				name: 'Analytics',
				icon: 'material-analytics',
				link: '/dashboard/analytics',
				children: [
					{
						id: '1-1-1',
						name: 'Real-time',
						icon: 'material-timer',
						link: '/dashboard/analytics/realtime'
					},
					{
						id: '1-1-2',
						name: 'Historical',
						icon: 'material-history',
						link: '/dashboard/analytics/historical'
					}
				]
			},
			{
				id: '1-2',
				name: 'Performance',
				icon: 'material-speed',
				link: '/dashboard/performance'
			}
		]
	},
	{
		id: '2',
		name: 'Projects',
		icon: 'material-folder',
		link: '/projects',
		children: [
			{
				id: '2-1',
				name: 'Active',
				icon: 'material-work',
				link: '/projects/active',
				children: [
					{
						id: '2-1-1',
						name: 'Development',
						icon: 'material-code',
						link: '/projects/active/dev'
					},
					{
						id: '2-1-2',
						name: 'Design',
						icon: 'material-palette',
						link: '/projects/active/design'
					}
				]
			},
			{
				id: '2-2',
				name: 'Archived',
				icon: 'material-archive',
				link: '/projects/archived'
			}
		]
	},
	{
		id: '3',
		name: 'Team',
		icon: 'material-group',
		link: '/team',
		children: [
			{
				id: '3-1',
				name: 'Members',
				icon: 'material-person',
				link: '/team/members',
				children: [
					{
						id: '3-1-1',
						name: 'Developers',
						icon: 'material-code',
						link: '/team/members/developers'
					},
					{
						id: '3-1-2',
						name: 'Designers',
						icon: 'material-palette',
						link: '/team/members/designers'
					}
				]
			},
			{
				id: '3-2',
				name: 'Groups',
				icon: 'material-groups',
				link: '/team/groups'
			}
		]
	},
	{
		id: '4',
		name: 'Settings',
		icon: 'material-settings',
		link: '/settings',
		children: [
			{
				id: '4-1',
				name: 'General',
				icon: 'material-tune',
				link: '/settings/general'
			},
			{
				id: '4-2',
				name: 'Security',
				icon: 'material-security',
				link: '/settings/security',
				children: [
					{
						id: '4-2-1',
						name: 'Authentication',
						icon: 'material-lock',
						link: '/settings/security/auth'
					},
					{
						id: '4-2-2',
						name: 'Permissions',
						icon: 'material-admin_panel_settings',
						link: '/settings/security/permissions'
					}
				]
			}
		]
	},
	{
		id: '5',
		name: 'Help',
		icon: 'material-help',
		link: '/help',
		children: [
			{
				id: '5-1',
				name: 'Documentation',
				icon: 'material-description',
				link: '/help/docs'
			},
			{
				id: '5-2',
				name: 'Support',
				icon: 'material-support',
				link: '/help/support'
			}
		]
	}
]

const MenuItem: FC<{
	item: MenuItem
	level: number
	expanded: { [key: string]: boolean }
	activeId: string
	onToggle: (id: string) => void
	onSelect: (id: string) => void
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
		<div className={clsx('menu-item-wrapper', `level-${level}`)}>
			<div
				className={clsx('menu-item', {
					expanded: isExpanded,
					'has-children': hasChildren,
					active: isActive(item)
				})}
				onClick={() => {
					if (item.link) {
						onSelect(item.id)
						// Handle navigation
						console.log('Navigate to:', item.link)
					}
					if (hasChildren) {
						onToggle(item.id)
					}
				}}
			>
				<div className='menu-item-content'>
					{item.icon && <Icon name={item.icon} size={16} />}
					{item.image && <img src={item.image} alt={item.name} className='menu-item-image' />}
					<span className='menu-item-name'>{item.name}</span>
				</div>
				{hasChildren && (
					<Icon
						name={isExpanded ? 'material-expand_less' : 'material-expand_more'}
						size={16}
						className={clsx('expand-icon', { active: isActive(item) })}
					/>
				)}
			</div>
			{hasChildren && isExpanded && (
				<div className='menu-children'>
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

const Menu: FC<MenuProps> = ({ isVisible = true, onToggle }) => {
	const [expanded, setExpanded] = useState<{ [key: string]: boolean }>({})
	const [searchTerm, setSearchTerm] = useState('')
	const [activeId, setActiveId] = useState('')
	const menuRef = useRef<HTMLDivElement>(null)

	const handleToggle = (id: string) => {
		setExpanded((prev) => ({
			...prev,
			[id]: !prev[id]
		}))
	}

	const handleSelect = (id: string) => {
		setActiveId(id)
	}

	return (
		<aside className={clsx('menu', { hidden: !isVisible })} ref={menuRef}>
			<div className='menu-search'>
				<Input
					prefix={<Icon name='material-search' size={16} />}
					placeholder='Search menu...'
					value={searchTerm}
					onChange={(e) => setSearchTerm(e.target.value)}
				/>
			</div>
			<div className='menu-items-container'>
				{testMenuItems.map((item) => (
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
			{isVisible && (
				<button className='menu-toggle menu-toggle-close' onClick={onToggle}>
					<Icon name='material-first_page' size={16} />
				</button>
			)}
		</aside>
	)
}

export default Menu
