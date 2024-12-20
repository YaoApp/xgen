import { FC, useState, useEffect } from 'react'
import { observer } from 'mobx-react-lite'
import { container } from 'tsyringe'
import { GlobalModel } from '@/context/app'
import { Tooltip } from 'antd'
import { MessageOutlined, SettingOutlined, DashboardOutlined, RobotOutlined } from '@ant-design/icons'
import clsx from 'clsx'
import './menu.less'

interface MenuItem {
	id: number
	name: string
	icon: React.ReactNode
	path?: string
}

// Test data for menu items
const TEST_MENU_ITEMS: MenuItem[] = [
	{
		id: 1,
		name: 'Chat with Assistant',
		icon: <MessageOutlined />,
		path: '/chat'
	},
	{
		id: 2,
		name: 'AI Assistants',
		icon: <RobotOutlined />,
		path: '/apps'
	},
	{
		id: 3,
		name: 'Admin Panel',
		icon: <DashboardOutlined />,
		path: '/settings'
	},
	{
		id: 4,
		name: 'Settings',
		icon: <SettingOutlined />,
		path: '/settings'
	}
]

interface Props {
	sidebarVisible?: boolean
	setSidebarVisible?: (visible: boolean) => void
}

const Menu: FC<Props> = ({ sidebarVisible, setSidebarVisible }) => {
	const global = container.resolve(GlobalModel)
	const [currentNav, setCurrentNav] = useState(1)

	const handleNavChange = (id: number) => {
		// setCurrentNav(id)

		//ID = 3
		if (id === 3 && setSidebarVisible) {
			setSidebarVisible(true)
		}
	}

	return (
		<div className={clsx('chat-main-menu', sidebarVisible && 'hidden')}>
			<div className='menu-content'>
				<Tooltip title={global.app_info?.name} placement='right'>
					<div className='menu-logo'>
						<img src={global.app_info?.logo} alt='Logo' />
					</div>
				</Tooltip>

				<div className='menu-items'>
					{TEST_MENU_ITEMS.map((menu) => (
						<Tooltip key={menu.id} title={menu.name} placement='right'>
							<div
								className={clsx('menu-item', menu.id === currentNav && 'active')}
								onClick={() => handleNavChange(menu.id)}
							>
								<span className='menu-icon'>{menu.icon}</span>
							</div>
						</Tooltip>
					))}
				</div>
			</div>
		</div>
	)
}

export default observer(Menu)
