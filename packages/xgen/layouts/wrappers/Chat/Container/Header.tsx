import { Button, Dropdown, Tooltip, Menu } from 'antd'
import { FC, useState, useEffect, useRef } from 'react'
import { container } from 'tsyringe'
import { GlobalModel } from '@/context/app'
import Icon from '@/widgets/Icon'
import clsx from 'clsx'
import './styles.css'

interface HeaderProps {
	onToggleSidebar: () => void
	isTemporaryView?: boolean
	currentPageName?: string
	temporaryLink?: string
	onBackToNormal?: () => void
}

interface CommonFunction {
	id: string
	name: string
	icon: string
	onClick: () => void
}

interface MenuItem {
	id: string
	name: string
	icon?: string
	onClick: () => void
	isActive?: boolean
}

const Header: FC<HeaderProps> = ({
	onToggleSidebar,
	isTemporaryView = false,
	currentPageName = '',
	onBackToNormal
}) => {
	const global = container.resolve(GlobalModel)
	const [activeMenuId, setActiveMenuId] = useState<string>('')
	const [visibleMenuItems, setVisibleMenuItems] = useState<number>(3)
	const menuContainerRef = useRef<HTMLDivElement>(null)
	const measureContainerRef = useRef<HTMLDivElement>(null)
	const itemWidthsRef = useRef<number[]>([])

	// Test data for menu items
	const menuItems: MenuItem[] = [
		{
			id: 'chat',
			name: 'Chat',
			icon: 'material-chat',
			onClick: () => setActiveMenuId('chat'),
			isActive: activeMenuId === 'chat'
		},
		{
			id: 'apps',
			name: 'Apps',
			icon: 'material-apps',
			onClick: () => setActiveMenuId('apps'),
			isActive: activeMenuId === 'apps'
		},
		{
			id: 'flows',
			name: 'Flows',
			icon: 'material-account_tree',
			onClick: () => setActiveMenuId('flows'),
			isActive: activeMenuId === 'flows'
		},
		{
			id: 'docs',
			name: 'Documents',
			icon: 'material-description',
			onClick: () => setActiveMenuId('docs'),
			isActive: activeMenuId === 'docs'
		},
		{
			id: 'teams',
			name: 'Teams',
			icon: 'material-group',
			onClick: () => setActiveMenuId('teams'),
			isActive: activeMenuId === 'teams'
		},
		{
			id: 'settings',
			name: 'Settings',
			icon: 'material-settings',
			onClick: () => setActiveMenuId('settings'),
			isActive: activeMenuId === 'settings'
		}
	]

	// Test data for common functions
	const commonFunctions: CommonFunction[] = [
		{ id: 'new_chat', name: 'New Chat', icon: 'material-chat', onClick: () => {} },
		{ id: 'new_app', name: 'New App', icon: 'material-add_box', onClick: () => {} },
		{ id: 'new_flow', name: 'New Flow', icon: 'material-account_tree', onClick: () => {} },
		{ id: 'new_doc', name: 'New Document', icon: 'material-description', onClick: () => {} },
		{ id: 'import', name: 'Import', icon: 'material-upload_file', onClick: () => {} },
		{ id: 'export', name: 'Export', icon: 'material-download', onClick: () => {} },
		{ id: 'share', name: 'Share', icon: 'material-share', onClick: () => {} },
		{ id: 'favorite', name: 'Favorites', icon: 'material-star', onClick: () => {} },
		{ id: 'recent', name: 'Recent', icon: 'material-history', onClick: () => {} },
		{ id: 'trash', name: 'Trash', icon: 'material-delete', onClick: () => {} }
	]

	useEffect(() => {
		const container = menuContainerRef.current
		const measureContainer = measureContainerRef.current
		if (!container || !measureContainer) return

		const measureItemWidths = () => {
			const measureItems = measureContainer.children
			const widths: number[] = []

			for (let i = 0; i < measureItems.length; i++) {
				const item = measureItems[i] as HTMLElement
				const itemWidth = item.getBoundingClientRect().width + 8 // Add gap
				widths.push(itemWidth)
			}

			itemWidthsRef.current = widths
		}

		const calculateVisibleItems = () => {
			// Get the header element's width
			const header = container.closest('.header') as HTMLElement
			if (!header) return

			// Get the header-right width
			const headerRight = header.querySelector('.header-right') as HTMLElement
			if (!headerRight) return

			// Calculate available width
			const headerWidth = header.getBoundingClientRect().width
			const headerRightWidth = headerRight.getBoundingClientRect().width
			const logo = header.querySelector('.header-logo') as HTMLElement
			const createNew = header.querySelector('.current-function') as HTMLElement

			const usedWidth =
				headerRightWidth +
				logo.getBoundingClientRect().width +
				createNew.getBoundingClientRect().width +
				64 // Total padding and gaps

			const availableWidth = headerWidth - usedWidth
			const moreMenuWidth = 40
			let currentWidth = 0
			let count = 0

			// Calculate how many items can fit
			for (let i = 0; i < itemWidthsRef.current.length; i++) {
				const itemWidth = itemWidthsRef.current[i]
				const remainingItems = itemWidthsRef.current.length - (i + 1)
				const needMoreMenu = remainingItems > 0

				if (currentWidth + itemWidth + (needMoreMenu ? moreMenuWidth : 0) <= availableWidth) {
					currentWidth += itemWidth
					count = i + 1
				} else {
					break
				}
			}

			setVisibleMenuItems(Math.max(1, count))
		}

		// Initial measurement and calculation
		requestAnimationFrame(() => {
			measureItemWidths()
			calculateVisibleItems()
		})

		const resizeObserver = new ResizeObserver(() => {
			requestAnimationFrame(() => {
				calculateVisibleItems()
			})
		})

		// Observe the header element instead
		const header = container.closest('.header')
		if (header) {
			resizeObserver.observe(header)
		}

		return () => {
			resizeObserver.disconnect()
		}
	}, [])

	const renderNormalMenu = () => (
		<div className='header-normal'>
			<div className='header-left'>
				{/* Logo */}
				<div className='header-logo'>
					<img src={global.app_info?.logo} alt='Logo' />
				</div>

				{/* Common Functions */}
				<Dropdown
					menu={{
						items: commonFunctions.map((func) => ({
							key: func.id,
							label: (
								<div className='common-function-item'>
									<Icon name={func.icon} size={14} />
									<span>{func.name}</span>
								</div>
							),
							onClick: func.onClick
						})),
						className: 'common-functions-dropdown'
					}}
					trigger={['hover']}
				>
					<div className='current-function'>
						<Icon name='material-add' size={14} />
						<span>Create New</span>
					</div>
				</Dropdown>

				{/* Hidden container for measurements */}
				<div className='menu-items-measure' ref={measureContainerRef}>
					{menuItems.map((item) => (
						<div key={item.id} className='menu-item'>
							{item.icon && <Icon name={item.icon} size={14} />}
							<span>{item.name}</span>
						</div>
					))}
				</div>

				{/* Visible menu items */}
				<div className='menu-items' ref={menuContainerRef}>
					{menuItems.map((item, index) => (
						<div
							key={item.id}
							className={clsx('menu-item', {
								active: item.isActive,
								hidden: index >= visibleMenuItems
							})}
							onClick={item.onClick}
						>
							{item.icon && <Icon name={item.icon} size={14} />}
							<span>{item.name}</span>
						</div>
					))}
					{menuItems.length > visibleMenuItems && (
						<Dropdown
							menu={{
								items: menuItems.slice(visibleMenuItems).map((item) => ({
									key: item.id,
									label: (
										<div
											className={clsx('menu-item', {
												active: item.isActive
											})}
											onClick={item.onClick}
										>
											{item.icon && <Icon name={item.icon} size={14} />}
											<span>{item.name}</span>
										</div>
									)
								})),
								className: 'more-menu-items'
							}}
							trigger={['hover']}
						>
							<div className='more-menu'>
								<Icon name='material-more_horiz' size={14} />
							</div>
						</Dropdown>
					)}
				</div>
			</div>

			<div className='header-right'>
				<Tooltip title='Terminal'>
					<Button
						type='text'
						className='header-icon-btn'
						icon={<Icon name='material-terminal' size={16} />}
					/>
				</Tooltip>
				<Button
					type='text'
					className='header-icon-btn'
					icon={<Icon name='material-close' size={16} />}
					onClick={onToggleSidebar}
				/>
			</div>
		</div>
	)

	const renderTemporaryView = () => (
		<div className='header-temporary'>
			<div className='header-left'>
				<span className='current-page'>{currentPageName}</span>
			</div>
			<div className='header-right'>
				<Tooltip title='Back'>
					<Button
						type='text'
						icon={<Icon name='material-chevron_left' size={16} />}
						onClick={onBackToNormal}
					/>
				</Tooltip>
				<Tooltip title='Close Sidebar'>
					<Button
						type='text'
						icon={<Icon name='material-chevron_right' size={16} />}
						onClick={onToggleSidebar}
					/>
				</Tooltip>
			</div>
		</div>
	)

	return <header className='header'>{isTemporaryView ? renderTemporaryView() : renderNormalMenu()}</header>
}

export default Header
