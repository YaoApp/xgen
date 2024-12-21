import { Button } from 'antd'
import { FC } from 'react'
import './styles.css'

interface HeaderProps {
	onToggleSidebar: () => void
}

const Header: FC<HeaderProps> = ({ onToggleSidebar }) => {
	return (
		<header className='header'>
			<Button onClick={onToggleSidebar}>Close Sidebar</Button>
			{/* Other header content will be added later */}
		</header>
	)
}

export default Header
