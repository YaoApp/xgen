import { MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons'

import type { IPropsLeft } from '../types'

const Index = (props: IPropsLeft) => {
      const { visible_menu, title, toggleMenu } = props
      
	return (
		<div className='left_wrap flex align_center'>
			<a
				className='icon_wrap cursor_point flex justify_center align_center transition_normal clickable'
				onClick={toggleMenu}
			>
				{visible_menu ? (
					<MenuFoldOutlined className='icon_fold' />
				) : (
					<MenuUnfoldOutlined className='icon_fold' />
				)}
			</a>
			<span className='page_title'>{title}</span>
		</div>
	)
}

export default window.$app.memo(Index)
