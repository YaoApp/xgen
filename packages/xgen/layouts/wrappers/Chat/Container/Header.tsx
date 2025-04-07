import { Button, Dropdown, Tooltip } from 'antd'
import { FC, useState, useEffect, useRef } from 'react'
import { container } from 'tsyringe'
import { GlobalModel } from '@/context/app'
import Icon from '@/widgets/Icon'
import clsx from 'clsx'
import './header.less'
import { App } from '@/types'
import { getLocale, useLocation, useNavigate } from '@umijs/max'
import { findNavPath } from './Utils'

interface HeaderProps {
	openSidebar: (temporaryLink?: string, title?: string) => void
	closeSidebar: () => void
	isTemporaryView?: boolean
	currentPageName?: string
	temporaryLink?: string
	onBackToNormal?: () => void
}

const Header: FC<HeaderProps> = ({
	openSidebar,
	closeSidebar,
	isTemporaryView = false,
	currentPageName = '',
	onBackToNormal
}) => {
	const global = container.resolve(GlobalModel)
	const current_path = useLocation().pathname
	const locale = getLocale()
	const is_cn = locale === 'zh-CN'

	const [activeMenuId, setActiveMenuId] = useState<string>(current_path)
	const [activeCommonFunctionId, setActiveCommonFunctionId] = useState<string>(current_path)
	const [visibleMenuItems, setVisibleMenuItems] = useState<number>(3)
	const menuContainerRef = useRef<HTMLDivElement>(null)
	const measureContainerRef = useRef<HTMLDivElement>(null)
	const itemWidthsRef = useRef<number[]>([])
	const quick_items = (global.menus?.quick || []).filter(
		(item) => item.path != '/chat' && item.path != 'open:sidebar'
	)
	const items = [...(global.menus?.items || []), ...(global.menus?.setting || [])].filter(
		(item) => item.path != '/chat' && item.path != 'open:sidebar'
	)

	const nav_path = findNavPath(current_path, items)
	const navigate = useNavigate()
	const handleNavChange = (menu: App.Menu) => {
		navigate(menu.path)
	}

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
		const visibleItems = items.slice(0, visibleMenuItems)
		const hiddenItems = items.slice(visibleMenuItems)
		const activeHiddenItem = hiddenItems.find((item) => false)

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
		const activeFunction = quick_items.find((item) => item.path === current_path)

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
							items: quick_items.map((item, index) => ({
								key: `${item.path}_${index}`,
								label: (
									<div
										className={clsx('header_common_function_item', {
											active: current_path?.startsWith(item.path)
										})}
									>
										{item.icon && (
											<Icon
												name={
													typeof item.icon === 'string'
														? item.icon
														: item.icon?.name
												}
												size={15}
											/>
										)}
										<span>{item.name}</span>
									</div>
								),
								onClick: () => handleNavChange(item)
							})),
							className: 'header_common_functions_dropdown'
						}}
						trigger={['hover']}
					>
						<div
							className={clsx('header_current_function', {
								active: activeFunction && current_path?.startsWith(activeFunction.path)
							})}
						>
							<Icon
								name={`${
									(activeFunction &&
										activeFunction.icon &&
										(typeof activeFunction.icon === 'string'
											? activeFunction.icon
											: activeFunction.icon.name)) ||
									'material-star'
								}`}
								size={15}
							/>
							<span>{activeFunction ? activeFunction.name : 'Quick Launch'}</span>
						</div>
					</Dropdown>

					{/* Hidden container for measurements */}
					<div className='header_menu_items_measure' ref={measureContainerRef}>
						{items.map((item, index) => (
							<div key={`m_${item.id}_${index}`} className='header_menu_item'>
								{item.icon && (
									<Icon
										name={
											typeof item.icon === 'string'
												? item.icon
												: item.icon?.name
										}
										size={15}
									/>
								)}
								<span>{item.name}</span>
							</div>
						))}
					</div>

					{/* Visible menu items */}
					<div className='header_menu_items' ref={menuContainerRef}>
						{finalVisibleItems.map((item, index) => (
							<div
								key={`v_${item.id}_${index}`}
								className={clsx('header_menu_item', {
									active:
										nav_path?.startsWith(item.path) &&
										activeFunction?.path != item.path
								})}
								onClick={() => handleNavChange(item)}
							>
								{item.icon && (
									<Icon
										name={
											typeof item.icon === 'string'
												? item.icon
												: item.icon.name
										}
										size={15}
									/>
								)}
								<span>{item.name}</span>
							</div>
						))}
						{items.length > visibleMenuItems && (
							<Dropdown
								menu={{
									items: dropdownItems.map((item, index) => ({
										key: `h_${item.id}_${index}`,
										label: (
											<div
												className={clsx('header_menu_item', {
													active:
														nav_path?.startsWith(item.path) &&
														activeFunction?.path != item.path
												})}
											>
												{item.icon && (
													<Icon
														name={
															typeof item.icon === 'string'
																? item.icon
																: item.icon.name
														}
														size={15}
													/>
												)}
												<span>{item.name}</span>
											</div>
										),
										onClick: () => handleNavChange(item)
									})),
									className: 'header_more_menu_items'
								}}
								trigger={['hover']}
							>
								<div className='header_more_menu'>
									<Icon name='material-more_horiz' size={15} />
								</div>
							</Dropdown>
						)}
					</div>
				</div>

				<div className='header_right'>
					<Tooltip title={is_cn ? 'AI 助手' : 'AI Assistants'}>
						<Button
							type='text'
							className='header_icon_btn'
							icon={<Icon name='material-assistant' size={16} />}
							onClick={() => navigate('/assistants')}
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
