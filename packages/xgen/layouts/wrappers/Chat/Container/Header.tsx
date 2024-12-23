import { Button, Dropdown, Tooltip, Menu } from 'antd'
import { FC, useState, useEffect, useRef } from 'react'
import { container } from 'tsyringe'
import { GlobalModel } from '@/context/app'
import Icon from '@/widgets/Icon'
import clsx from 'clsx'
import './header.less'

interface HeaderProps {
	openSidebar: (temporaryLink?: string, title?: string) => void
	closeSidebar: () => void
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
	openSidebar,
	closeSidebar,
	isTemporaryView = false,
	currentPageName = '',
	onBackToNormal
}) => {
	const global = container.resolve(GlobalModel)
	const [activeMenuId, setActiveMenuId] = useState<string>('')
	const [activeCommonFunctionId, setActiveCommonFunctionId] = useState<string>('')
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
			onClick: () => {
				setActiveMenuId('chat')
				setActiveCommonFunctionId('')
			},
			isActive: activeMenuId === 'chat' && !activeCommonFunctionId
		},
		{
			id: 'apps',
			name: 'Apps',
			icon: 'material-apps',
			onClick: () => {
				setActiveMenuId('apps')
				setActiveCommonFunctionId('')
			},
			isActive: activeMenuId === 'apps' && !activeCommonFunctionId
		},
		{
			id: 'flows',
			name: 'Flows',
			icon: 'material-account_tree',
			onClick: () => {
				setActiveMenuId('flows')
				setActiveCommonFunctionId('')
			},
			isActive: activeMenuId === 'flows' && !activeCommonFunctionId
		},
		{
			id: 'docs',
			name: 'Documents',
			icon: 'material-description',
			onClick: () => {
				setActiveMenuId('docs')
				setActiveCommonFunctionId('')
			},
			isActive: activeMenuId === 'docs' && !activeCommonFunctionId
		},
		{
			id: 'teams',
			name: 'Teams',
			icon: 'material-group',
			onClick: () => {
				setActiveMenuId('teams')
				setActiveCommonFunctionId('')
			},
			isActive: activeMenuId === 'teams' && !activeCommonFunctionId
		},
		{
			id: 'settings',
			name: 'Settings',
			icon: 'material-settings',
			onClick: () => {
				setActiveMenuId('settings')
				setActiveCommonFunctionId('')
			},
			isActive: activeMenuId === 'settings' && !activeCommonFunctionId
		}
	]

	// Test data for common functions
	const commonFunctions: CommonFunction[] = [
		{
			id: 'new_chat',
			name: 'New Chat',
			icon: 'material-chat',
			onClick: () => {
				setActiveCommonFunctionId('new_chat')
				setActiveMenuId('')
			}
		},
		{
			id: 'new_app',
			name: 'New App',
			icon: 'material-add_box',
			onClick: () => {
				setActiveCommonFunctionId('new_app')
				setActiveMenuId('')
			}
		},
		{
			id: 'new_flow',
			name: 'New Flow',
			icon: 'material-account_tree',
			onClick: () => {
				setActiveCommonFunctionId('new_flow')
				setActiveMenuId('')
			}
		},
		{
			id: 'new_doc',
			name: 'New Document',
			icon: 'material-description',
			onClick: () => {
				setActiveCommonFunctionId('new_doc')
				setActiveMenuId('')
			}
		},
		{
			id: 'import',
			name: 'Import',
			icon: 'material-upload_file',
			onClick: () => {
				setActiveCommonFunctionId('import')
				setActiveMenuId('')
			}
		},
		{
			id: 'export',
			name: 'Export',
			icon: 'material-download',
			onClick: () => {
				setActiveCommonFunctionId('export')
				setActiveMenuId('')
			}
		},
		{
			id: 'share',
			name: 'Share',
			icon: 'material-share',
			onClick: () => {
				setActiveCommonFunctionId('share')
				setActiveMenuId('')
			}
		},
		{
			id: 'favorite',
			name: 'Favorites',
			icon: 'material-star',
			onClick: () => {
				setActiveCommonFunctionId('favorite')
				setActiveMenuId('')
			}
		},
		{
			id: 'recent',
			name: 'Recent',
			icon: 'material-history',
			onClick: () => {
				setActiveCommonFunctionId('recent')
				setActiveMenuId('')
			}
		},
		{
			id: 'trash',
			name: 'Trash',
			icon: 'material-delete',
			onClick: () => {
				setActiveCommonFunctionId('trash')
				setActiveMenuId('')
			}
		}
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
			const header = container.closest('.header_container') as HTMLElement
			if (!header) return

			// Get the header-right width
			const headerRight = header.querySelector('.header_right') as HTMLElement
			if (!headerRight) return

			// Calculate available width
			const headerWidth = header.getBoundingClientRect().width
			const headerRightWidth = headerRight.getBoundingClientRect().width
			const logo = header.querySelector('.header_logo') as HTMLElement
			const createNew = header.querySelector('.header_current_function') as HTMLElement

			if (!logo || !createNew) return

			// Add some buffer for padding and spacing
			const BUFFER_SPACE = 80
			const logoWidth = logo.getBoundingClientRect().width
			const createNewWidth = createNew.getBoundingClientRect().width

			const usedWidth = headerRightWidth + logoWidth + createNewWidth + BUFFER_SPACE

			const availableWidth = headerWidth - usedWidth
			const moreMenuWidth = 48
			let currentWidth = 0
			let count = 0

			// Calculate how many items can fit
			for (let i = 0; i < itemWidthsRef.current.length; i++) {
				const itemWidth = itemWidthsRef.current[i]
				const remainingItems = itemWidthsRef.current.length - (i + 1)
				const needMoreMenu = remainingItems > 0

				// Add the "More" menu width if there will be hidden items
				const totalWidthNeeded = currentWidth + itemWidth + (needMoreMenu ? moreMenuWidth : 0)

				if (totalWidthNeeded <= availableWidth) {
					currentWidth += itemWidth
					count = i + 1
				} else {
					break
				}
			}

			// Ensure we show at least one item
			const finalCount = Math.max(1, Math.min(count, itemWidthsRef.current.length))

			// If we're showing all items except one, show the more menu anyway
			if (finalCount === itemWidthsRef.current.length - 1) {
				setVisibleMenuItems(finalCount - 1)
			} else {
				setVisibleMenuItems(finalCount)
			}
		}

		// Initial measurement and calculation
		const recalculate = () => {
			requestAnimationFrame(() => {
				measureItemWidths()
				calculateVisibleItems()
			})
		}

		recalculate()

		const resizeObserver = new ResizeObserver(recalculate)

		// Observe the header element instead
		const header = container.closest('.header_container')
		if (header) {
			resizeObserver.observe(header)
		}

		return () => {
			resizeObserver.disconnect()
		}
	}, [isTemporaryView])

	useEffect(() => {
		// Reset menu state when switching back from temporary view
		if (!isTemporaryView) {
			setActiveMenuId('chat') // Or whatever should be the default active menu
			setActiveCommonFunctionId('')
		}
	}, [isTemporaryView])

	const renderNormalMenu = () => {
		// Determine visible and hidden items
		const visibleItems = menuItems.slice(0, visibleMenuItems)
		const hiddenItems = menuItems.slice(visibleMenuItems)
		const activeHiddenItem = hiddenItems.find((item) => item.isActive)

		// Create the final list of visible items
		let finalVisibleItems = [...visibleItems]
		if (activeHiddenItem) {
			// Replace the last visible item with the active hidden item
			finalVisibleItems = [...visibleItems.slice(0, -1), activeHiddenItem]
		}

		// Create the list of items for the dropdown
		const dropdownItems = activeHiddenItem
			? [
					...hiddenItems.filter((item) => item.id !== activeHiddenItem.id),
					visibleItems[visibleItems.length - 1]
			  ]
			: hiddenItems

		// Find active common function
		const activeFunction = commonFunctions.find((func) => func.id === activeCommonFunctionId)

		return (
			<div className='header_normal'>
				<div className='header_left'>
					{/* Logo */}
					<div className='header_logo'>
						<img src={global.app_info?.logo} alt='Logo' />
					</div>

					{/* Common Functions */}
					<Dropdown
						menu={{
							items: commonFunctions.map((func) => ({
								key: func.id,
								label: (
									<div
										className={clsx('header_common_function_item', {
											active: func.id === activeCommonFunctionId
										})}
									>
										<Icon name={func.icon} size={14} />
										<span>{func.name}</span>
									</div>
								),
								onClick: func.onClick
							})),
							className: 'header_common_functions_dropdown'
						}}
						trigger={['hover']}
					>
						<div
							className={clsx('header_current_function', {
								active: !!activeCommonFunctionId
							})}
						>
							<Icon
								name={activeFunction ? activeFunction.icon : 'material-star'}
								size={14}
							/>
							<span>{activeFunction ? activeFunction.name : 'Quick Actions'}</span>
						</div>
					</Dropdown>

					{/* Hidden container for measurements */}
					<div className='header_menu_items_measure' ref={measureContainerRef}>
						{menuItems.map((item) => (
							<div key={item.id} className='header_menu_item'>
								{item.icon && <Icon name={item.icon} size={14} />}
								<span>{item.name}</span>
							</div>
						))}
					</div>

					{/* Visible menu items */}
					<div className='header_menu_items' ref={menuContainerRef}>
						{finalVisibleItems.map((item) => (
							<div
								key={item.id}
								className={clsx('header_menu_item', {
									active: item.isActive
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
									items: dropdownItems.map((item) => ({
										key: item.id,
										label: (
											<div
												className={clsx('header_menu_item', {
													active: item.isActive
												})}
											>
												{item.icon && (
													<Icon name={item.icon} size={14} />
												)}
												<span>{item.name}</span>
											</div>
										),
										onClick: item.onClick
									})),
									className: 'header_more_menu_items'
								}}
								trigger={['hover']}
							>
								<div className='header_more_menu'>
									<Icon name='material-more_horiz' size={14} />
								</div>
							</Dropdown>
						)}
					</div>
				</div>

				<div className='header_right'>
					<Tooltip title='Terminal'>
						<Button
							type='text'
							className='header_icon_btn'
							icon={<Icon name='material-terminal' size={16} />}
						/>
					</Tooltip>
					<Button
						type='text'
						className='header_icon_btn'
						icon={<Icon name='material-close' size={16} />}
						onClick={closeSidebar}
					/>
				</div>
			</div>
		)
	}

	const renderTemporaryView = () => (
		<div className='header_temporary'>
			<div className='header_left'>
				<span className='header_current_page'>{currentPageName}</span>
			</div>
			<div className='header_right'>
				<Button
					type='text'
					className='header_icon_btn back-btn'
					style={{ marginRight: '2px', width: 'auto' }}
					onClick={onBackToNormal}
				>
					<Icon name='material-chevron_left' size={16} style={{ marginRight: '0px' }} />
					<span>Back</span>
				</Button>
				<Button
					type='text'
					className='header_icon_btn'
					icon={<Icon name='material-close' size={16} />}
					onClick={closeSidebar}
				/>
			</div>
		</div>
	)

	return (
		<header className='header_container'>{isTemporaryView ? renderTemporaryView() : renderNormalMenu()}</header>
	)
}

export default Header
