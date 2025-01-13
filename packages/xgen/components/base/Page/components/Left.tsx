import { Else, If, Then } from 'react-if'

import { MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons'

import type { IPropsLeft } from '../types'
import { useEffect, useState } from 'react'

const Index = (props: IPropsLeft) => {
	const { title, visible_menu, toggleVisibleMenu, layout } = props
	const isChat = layout == 'Chat'

	const [visible, setVisible] = useState(visible_menu)
	const handleToggleMenu = isChat
		? () => window.$app.Event.emit('app/toggleMenu')
		: () => {
				setVisible(!visible)
				toggleVisibleMenu()
		  }

	useEffect(() => {
		if (!isChat) return
		const handleMenuChange = ({ isMenuVisible, showMenu }: { isMenuVisible: boolean; showMenu: boolean }) => {
			setVisible(isMenuVisible)
		}
		window.$app.Event.on('app/onMenuChange', handleMenuChange)
		return () => {
			window.$app.Event.off('app/onMenuChange', handleMenuChange)
		}
	}, [isChat])

	return (
		<div className='left_wrap flex align_center'>
			<a
				className='icon_wrap cursor_point flex justify_center align_center transition_normal clickable'
				onClick={handleToggleMenu}
			>
				<If condition={!visible}>
					<Else>
						<MenuFoldOutlined className='icon_fold' />
					</Else>
					<Then>
						<MenuUnfoldOutlined className='icon_fold' />
					</Then>
				</If>
			</a>
			<span
				className='page_title'
				style={{
					maxWidth: '200px',
					overflow: 'hidden',
					textOverflow: 'ellipsis',
					whiteSpace: 'nowrap',
					display: 'block'
				}}
			>
				{title}
			</span>
		</div>
	)
}

export default window.$app.memo(Index)
