import { FC, useState } from 'react'
import { observer } from 'mobx-react-lite'
import { container } from 'tsyringe'
import { GlobalModel } from '@/context/app'
import { Tooltip } from 'antd'
import { useNavigate } from 'react-router-dom'
import clsx from 'clsx'
import './menu.less'
import { Icon } from '@/widgets'
import { App } from '@/types'
import ReactNiceAvatar from 'react-nice-avatar'

interface Props {
	sidebarVisible?: boolean
	setSidebarVisible?: (visible: boolean) => void
	closeSidebar?: () => void
	openSidebar?: (temporaryLink?: string, title?: string) => void
}

const Menu: FC<Props> = ({ sidebarVisible, setSidebarVisible, openSidebar }) => {
	const global = container.resolve(GlobalModel)
	const [currentNav, setCurrentNav] = useState(0)
	const quick_items = global.menus?.quick || []
	const navigate = useNavigate()

	const getUserDisplayInfo = () => {
		const user = global.user || {}
		const { name, mobile, email } = user
		return name || mobile || email || 'User'
	}

	if (quick_items.length == 0) {
		return null
	}

	const NavigateTo = (path: string) => {
		navigate(path)
		setSidebarVisible?.(true)
	}

	const handleNavChange = (menu: App.Menu) => {
		if (menu.path === '/chat') {
			setCurrentNav(0)
			return
		} else if (menu.path === 'open:sidebar') {
			setSidebarVisible?.(true)
			return
		}

		NavigateTo(menu.path)
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
					{quick_items.map((menu, index) => (
						<Tooltip key={index} title={menu.name} placement='right'>
							<div
								className={clsx('menu-item', index === currentNav && 'active')}
								onClick={() => handleNavChange(menu)}
							>
								<span className='menu-icon'>
									{menu.icon && (
										<Icon
											name={
												typeof menu.icon === 'string'
													? menu.icon
													: menu.icon.name
											}
											size={
												typeof menu.icon === 'string'
													? 24
													: menu.icon.size
											}
										/>
									)}
								</span>
							</div>
						</Tooltip>
					))}
				</div>

				<Tooltip title={getUserDisplayInfo()} placement='right'>
					<div className='menu-avatar' onClick={() => NavigateTo('/setting')}>
						<ReactNiceAvatar
							className='avatar'
							style={{ width: 32, height: 32 }}
							{...global.avatar}
						/>
					</div>
				</Tooltip>
			</div>
		</div>
	)
}

export default observer(Menu)
