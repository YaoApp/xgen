import { Button } from 'antd'
import store from 'store2'

import { Icon } from '@/components'
import { history } from '@umijs/max'

import type { IPropsOptions } from '@/layouts/types'

export interface IProps {
	user: IPropsOptions['user']
	text_logout: string
	Avatar: JSX.Element
}

const Index = (props: IProps) => {
	const { user, text_logout, Avatar } = props

	return (
		<div className='user_wrap flex flex_column relative'>
			<div className='info_wrap w_100 border_box flex align_center'>
				{Avatar}
				<div className='info flex flex_column'>
					<span className='user_name'>{user.name}</span>
					<span className='user_account'>{user.email || user.mobile}</span>
				</div>
			</div>
			<div className='btn_wrap w_100 border_box'>
				<Button
					className='btn_logout w_100 flex justify_center align_center'
					type='primary'
					onClick={() => {
						store.remove('user')
						store.remove('menu')
						store.remove('current_nav')
						store.remove('current_menu')
						store.session.remove('token')

						history.push(store.get('login_url') || '/')
					}}
				>
					<Icon name='icon-log-out' size={15} color='white'></Icon>
					<span className='text'>{text_logout}</span>
				</Button>
			</div>
		</div>
	)
}

export default window.$app.memo(Index)
