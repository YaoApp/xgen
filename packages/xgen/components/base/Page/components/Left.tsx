import { MenuFoldOutlined } from '@ant-design/icons'

import type { IPropsLeft } from '../types'

const Index = (props: IPropsLeft) => {
	const { title } = props

	return (
		<div className='left_wrap flex align_center'>
			<a className='icon_wrap cursor_point flex justify_center align_center transition_normal clickable'>
				<MenuFoldOutlined className='icon_fold' />
			</a>
			<span className='page_title'>{title}</span>
		</div>
	)
}

export default window.$app.memo(Index)
