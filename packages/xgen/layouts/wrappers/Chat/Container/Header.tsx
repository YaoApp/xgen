import { Button, Dropdown, Tooltip, Menu } from 'antd'
import { FC, useState, useEffect, useRef } from 'react'
import { container } from 'tsyringe'
import { GlobalModel } from '@/context/app'
import Icon from '@/widgets/Icon'
import clsx from 'clsx'
import './styles.css'

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
									<div
										className={clsx('common-function-item', {
											active: func.id === activeCommonFunctionId
										})}
									>
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
						<div
							className={clsx('current-function', {
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
						{finalVisibleItems.map((item) => (
							<div
								key={item.id}
								className={clsx('menu-item', {
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
												className={clsx('menu-item', {
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
						onClick={closeSidebar}
					/>
				</div>
			</div>
		)
	}

	const renderTemporaryView = () => (
		<div className='header-temporary'>
			<div className='header-left'>
				<span className='current-page'>{currentPageName}</span>
			</div>
			<div className='header-right'>
				<Button
					type='text'
					className='header-icon-btn back-btn'
					style={{ marginRight: '2px', width: 'auto' }}
					onClick={onBackToNormal}
				>
					<Icon name='material-chevron_left' size={16} style={{ marginRight: '0px' }} />
					<span>Back</span>
				</Button>
				<Button
					type='text'
					className='header-icon-btn'
					icon={<Icon name='material-close' size={16} />}
					onClick={closeSidebar}
				/>
			</div>
		</div>
	)

	return <header className='header'>{isTemporaryView ? renderTemporaryView() : renderNormalMenu()}</header>
}

export default Header
