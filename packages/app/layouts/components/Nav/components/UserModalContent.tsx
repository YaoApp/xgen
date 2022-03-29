import { Button, Tooltip } from 'antd'
import store from 'store2'

import { Icon } from '@/widgets'
import { history } from '@umijs/max'

import type { IPropsUserModalContent } from '@/layouts/types'

const Index = (props: IPropsUserModalContent) => {
	const { user, locale_messages, Avatar, setAvatar } = props

	return (
		<div className='user_wrap flex flex_column relative'>
			<Tooltip title={locale_messages.layout.avatar.reset}>
				<div
					className='btn_reset_avatar flex justify_center align_center absolute clickable'
					onClick={() => setAvatar()}
				>
					<Icon className='icon_reset' name='refresh-outline' size={18}></Icon>
				</div>
			</Tooltip>
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
					<span className='text'>{locale_messages.layout.logout}</span>
				</Button>
			</div>
		</div>
	)
}

export default window.$app.memo(Index)
