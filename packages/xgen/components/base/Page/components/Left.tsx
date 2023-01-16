import { Else, If, Then } from 'react-if'

import { MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons'

import type { IPropsLeft } from '../types'

const Index = (props: IPropsLeft) => {
	const { title, visible_menu, toggleVisibleMenu } = props

	return (
		<div className='left_wrap flex align_center'>
			<a
				className='icon_wrap cursor_point flex justify_center align_center transition_normal clickable'
				onClick={toggleVisibleMenu}
			>
				<If condition={!visible_menu}>
					<Else>
						<MenuFoldOutlined className='icon_fold' />
					</Else>
					<Then>
						<MenuUnfoldOutlined className='icon_fold' />
					</Then>
				</If>
			</a>
			<span className='page_title'>{title}</span>
		</div>
	)
}

export default window.$app.memo(Index)
