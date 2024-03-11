import { Button, Switch } from 'antd'
import clsx from 'clsx'
import { observer } from 'mobx-react-lite'

import { useGlobal } from '@/context/app'
import { useIntl } from '@/hooks'
import { getLocale, setLocale, history } from '@umijs/max'
import { local } from '@yaoapp/storex'
import { difference } from 'lodash-es'

import styles from './index.less'
import { useMemoizedFn } from 'ahooks'
import ReactNiceAvatar from 'react-nice-avatar'

const Index = () => {
	const global = useGlobal()
	const messages = useIntl()
	const locale = getLocale()
	const is_cn = locale === 'zh-CN'
	const user = global.user || {}

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

	const Avatar = (
		<ReactNiceAvatar
			className='avatar cursor_point transition_normal'
			style={{ width: 40, height: 40 }}
			{...global.avatar}
		/>
	)

	return (
		<div className={clsx([styles._local, 'w_100 border_box flex flex_column'])}>
			<div className='setting_items w_100 border_box flex flex_column'>
				<div className='setting_item w_100 border_box flex justify_between align_center'>
					<span className='name'>
						<div className='info_wrap w_100 border_box flex align_center'>
							{Avatar}
							<div className='info flex flex_column' style={{ marginLeft: 10 }}>
								<span className='user_name'>{user.name}</span>
								<span className='user_account'>{user.email || user.mobile}</span>
							</div>
						</div>
					</span>
					<Button type='primary' size='small' onClick={clearStorage}>
						{messages.layout.logout}
					</Button>
				</div>
			</div>

			<div className='setting_items w_100 border_box flex flex_column mt_20'>
				<div className='setting_item w_100 border_box flex justify_between align_center'>
					<span className='name'>{messages.layout.setting.system.name}</span>
					<span className='desc'>{global.app_info?.name}</span>
				</div>

				<div className='setting_item w_100 border_box flex justify_between align_center'>
					<span className='name'>{messages.layout.setting.system.version}</span>
					<span className='desc'>{global.app_info?.version}</span>
				</div>

				<div className='setting_item w_100 border_box flex justify_between align_center'>
					<span className='name'>{messages.layout.setting.language.title}</span>
					<Switch
						checkedChildren='EN'
						unCheckedChildren='中文'
						checked={!is_cn}
						onChange={(v) => setLocale(v ? 'en-US' : 'zh-CN')}
					/>
				</div>
				<div className='setting_item w_100 border_box flex justify_between align_center'>
					<span className='name'>{messages.layout.setting.theme.title}</span>
					<Switch
						checkedChildren='light'
						unCheckedChildren='dark'
						checked={global.theme === 'light'}
						onChange={(v) => global.setTheme(v ? 'light' : 'dark')}
					/>
				</div>
			</div>
		</div>
	)
}

export default new window.$app.Handle(Index).by(observer).by(window.$app.memo).get()
