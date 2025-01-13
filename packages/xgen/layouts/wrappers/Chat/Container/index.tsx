import { FC, PropsWithChildren, useState, useEffect, useRef } from 'react'
import Icon from '@/widgets/Icon'
import Header from './Header'
import Menu, { MenuItem } from './Menu'
import './style.less'
import { App } from '@/types'
import { container } from 'tsyringe'
import { useLocation, useNavigate } from '@umijs/max'
import { GlobalModel } from '@/context/app'
import { findNavPath } from './Utils'

interface ContainerProps {
	openSidebar: (temporaryLink?: string, title?: string) => void
	closeSidebar: () => void
	showMenu?: boolean
	isMaximized?: boolean
	temporaryLink?: string
	currentPageName?: string
	isTemporaryView?: boolean
	onBackToNormal?: () => void
}

const Container: FC<PropsWithChildren<ContainerProps>> = ({
	children,
	isMaximized,
	openSidebar,
	closeSidebar,
	showMenu = true,
	temporaryLink,
	currentPageName,
	isTemporaryView,
	onBackToNormal
}) => {
	const [isMenuVisible, setIsMenuVisible] = useState(true)
	const contentRef = useRef<HTMLDivElement>(null)
	const mainContentRef = useRef<HTMLDivElement>(null)
	const [isUserToggled, setIsUserToggled] = useState(false)

	useEffect(() => {
		const checkWidth = () => {
			if (mainContentRef.current) {
				const totalWidth = mainContentRef.current.getBoundingClientRect().width
				if (!isUserToggled) {
					setIsMenuVisible(totalWidth > 960)
				}
			}
		}

		const resizeObserver = new ResizeObserver(checkWidth)
		if (mainContentRef.current) {
			resizeObserver.observe(mainContentRef.current)
		}

		checkWidth()

		return () => {
			resizeObserver.disconnect()
		}
	}, [isUserToggled])

	useEffect(() => {
		// Register event listener for external menu toggle
		const handleExternalToggle = () => {
			setIsUserToggled(true)
			setIsMenuVisible((prev) => !prev)
		}

		window.$app.Event.on('app/toggleMenu', handleExternalToggle)

		return () => {
			window.$app.Event.off('app/toggleMenu', handleExternalToggle)
		}
	}, [])

	const toggleMenu = () => {
		setIsUserToggled(true)
		setIsMenuVisible((prev) => !prev)
	}

	const global = container.resolve(GlobalModel)
	const menuItems = [...(global.menus?.items || []), ...(global.menus?.setting || [])].filter(
		(item) => item.path != '/chat'
	)

	const navigate = useNavigate()
	const current_path = useLocation().pathname
	const nav_path = findNavPath(current_path, menuItems)
	const current_menu = menuItems.find((item) => item.path === nav_path)
	showMenu = (current_menu && current_menu?.children && current_menu?.children?.length > 0) || false

	// Trigger toggleMenu when the menu is toggled
	window.$app.Event.emit('app/onMenuChange', { isMenuVisible, showMenu })

	useEffect(() => {
		// Emit menu visibility change event
		window.$app.Event.emit('app/onMenuChange', { isMenuVisible, showMenu })
	}, [isMenuVisible])

	let activeId = ''
	const toMenuItems = (items: App.Menu[], hasParent: boolean = false): MenuItem[] => {
		return items.map((item, index) => {
			if (item.path === current_path) {
				activeId = `${item.path}-${index}`
			}
			return {
				id: `${item.path}-${index}`,
				name: item.name,
				icon: typeof item.icon === 'string' ? item.icon : (item.icon as { name: string })?.name,
				link: item.path,
				hasParent,
				children: item.children ? toMenuItems(item.children, true) : undefined
			}
		})
	}

	const items = toMenuItems(current_menu?.children || [])
	const onSelect = (item: MenuItem) => {
		if (item.children && item.children.length > 0) {
			return
		}

		if (item.link) {
			navigate(item.link)
			return
		}

		console.error('item.link is not defined')
	}

	return (
		<div className='container' style={{ marginLeft: isMaximized ? 0 : 2 }}>
			<Header
				openSidebar={openSidebar}
				closeSidebar={closeSidebar}
				isTemporaryView={isTemporaryView}
				currentPageName={currentPageName}
				temporaryLink={temporaryLink}
				onBackToNormal={onBackToNormal}
			/>
			<div className='mainContent' ref={mainContentRef}>
				{showMenu && (
					<Menu
						items={items}
						isVisible={isMenuVisible}
						activeId={activeId}
						onToggle={toggleMenu}
						onSelect={onSelect}
					/>
				)}
				<main className='content' ref={contentRef}>
					<div className='content_wrapper'>{children}</div>
					{/* {showMenu && !isMenuVisible && (
						<button className='menu_toggle menu_toggle_open' onClick={toggleMenu}>
							<Icon name='material-menu' size={14} />
						</button>
					)} */}
				</main>
			</div>
		</div>
	)
}

export default Container
