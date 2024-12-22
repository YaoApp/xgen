import { FC, PropsWithChildren } from 'react'
import Header from './Header'
import Sidebar from './Sidebar'
import './styles.css'

interface ContainerProps {
	openSidebar: (temporaryLink?: string, title?: string) => void
	closeSidebar: () => void
	showLeftSidebar?: boolean
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
	showLeftSidebar = false,
	temporaryLink,
	currentPageName,
	isTemporaryView,
	onBackToNormal
}) => {
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
			<div className='mainContent'>
				{showLeftSidebar && <Sidebar />}
				<main className='content'>{children}</main>
			</div>
		</div>
	)
}

export default Container
