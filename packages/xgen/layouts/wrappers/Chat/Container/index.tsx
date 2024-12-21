import { FC, PropsWithChildren } from 'react'
import Header from './Header'
import Sidebar from './Sidebar'
import './styles.css'

interface ContainerProps {
	onToggleSidebar: () => void
	showLeftSidebar?: boolean
	isMaximized?: boolean
}

const Container: FC<PropsWithChildren<ContainerProps>> = ({
	children,
	isMaximized,
	onToggleSidebar,
	showLeftSidebar = false
}) => {
	return (
		<div className='container' style={{ marginLeft: isMaximized ? 0 : 2 }}>
			<Header onToggleSidebar={onToggleSidebar} />
			<div className='mainContent'>
				{showLeftSidebar && <Sidebar />}
				<main className='content'>{children}</main>
			</div>
		</div>
	)
}

export default Container
