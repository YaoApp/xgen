import { useMemoizedFn } from 'ahooks'
import { Button, Tooltip } from 'antd'
import { difference } from 'lodash-es'

import { Icon } from '@/widgets'
import { history } from '@umijs/max'
import { local } from '@yaoapp/storex'

import type { IPropsUserModalContent } from '@/layouts/types'

const Index = (props: IPropsUserModalContent) => {
	const { user, locale_messages, Avatar, setAvatar } = props

	const clearStorage = useMemoizedFn(() => {
		if (!local.logout_redirect) {
			history.push(local.login_url || '/')
		}

		const excludes = ['paths', 'avatar', 'xgen_theme', 'remote_cache', 'token_storage', 'temp_sid']
		const all = []
		for (let index = 0; index < localStorage.length; index++) {
			all.push(localStorage.key(index)!)
		}

		difference(all, excludes).map((item) => local.removeItem(item))
		sessionStorage.clear()

		// Clear the token and studio token
		localStorage.removeItem('xgen:token')
		localStorage.removeItem('xgen:studio')

		// Redirect to the custom logout page
		if (local.logout_redirect) {
			window.location = local.logout_redirect
			return
		}
	})

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
					onClick={clearStorage}
				>
					<Icon name='icon-log-out' size={15} color='white'></Icon>
					<span className='text'>{locale_messages.layout.logout}</span>
				</Button>
			</div>
		</div>
	)
}

export default window.$app.memo(Index)
