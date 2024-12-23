import { FC, PropsWithChildren, useState, useEffect, useRef } from 'react'
import Icon from '@/widgets/Icon'
import Header from './Header'
import Menu from './Menu'
import './style.less'

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

	const toggleMenu = () => {
		setIsUserToggled(true)
		setIsMenuVisible((prev) => !prev)
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
				{showMenu && <Menu isVisible={isMenuVisible} onToggle={toggleMenu} />}
				<main className='content' ref={contentRef}>
					<div className='content_wrapper'>{children}</div>
					{showMenu && !isMenuVisible && (
						<button className='menu_toggle menu_toggle_open' onClick={toggleMenu}>
							<Icon name='material-menu' size={14} />
						</button>
					)}
				</main>
			</div>
		</div>
	)
}

export default Container
