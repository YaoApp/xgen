import { Button, Radio } from 'antd'
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
					<span className='name'>{messages.layout.setting.language.title}</span>
					<Radio.Group
						value={is_cn ? 'zh-CN' : 'en-US'}
						onChange={(e) => setLocale(e.target.value)}
						options={[
							{ label: '中文', value: 'zh-CN' },
							{ label: 'EN', value: 'en-US' }
						]}
						optionType='button'
						buttonStyle='solid'
						size='small'
					/>
				</div>
				<div className='setting_item w_100 border_box flex justify_between align_center'>
					<span className='name'>{messages.layout.setting.theme.title}</span>
					<Radio.Group
						value={global.theme}
						onChange={(e) => global.setTheme(e.target.value)}
						options={[
							{ label: 'Light', value: 'light' },
							{ label: 'Dark', value: 'dark' }
						]}
						optionType='button'
						buttonStyle='solid'
						size='small'
					/>
				</div>
				<div className='setting_item w_100 border_box flex justify_between align_center'>
					<span className='name'>{is_cn ? '布局' : 'Layout'}</span>
					<Radio.Group
						value={global.layout}
						onChange={(e) => global.setLayout(e.target.value)}
						options={[
							{ label: 'Chat', value: 'Chat' },
							{ label: 'Admin', value: 'Admin' }
						]}
						optionType='button'
						buttonStyle='solid'
						size='small'
					/>
				</div>
			</div>

			{/* System Info */}
			<div className='w_100 flex justify_center align_center' style={{ marginTop: 32, marginBottom: 12 }}>
				<span style={{ fontSize: '16px', fontWeight: 500, color: 'var(--color_text)' }}>
					{is_cn ? '应用信息' : 'App Info'}
				</span>
			</div>
			<div className='setting_items w_100 border_box flex flex_column mt_10'>
				<div className='setting_item w_100 border_box flex justify_between align_center'>
					<span className='name'>{is_cn ? '应用名称' : 'App Name'}</span>
					<span className='desc'>{global.app_info?.name}</span>
				</div>

				{global.app_info?.description && (
					<div className='setting_item w_100 border_box flex justify_between align_center'>
						<span className='desc'>{global.app_info?.description}</span>
					</div>
				)}

				{global.app_info?.version && (
					<div className='setting_item w_100 border_box flex justify_between align_center'>
						<span className='name'>{is_cn ? '应用版本' : 'App Version'}</span>
						<span className='desc'>{global.app_info?.version}</span>
					</div>
				)}

				{global.app_info?.yao?.version && (
					<div className='setting_item w_100 border_box flex justify_between align_center'>
						<span className='name'>{is_cn ? 'Yao 版本' : 'Yao Version'}</span>
						<span className='desc'>
							<a href='https://yaoapps.com' target='_blank'>
								{global.app_info?.yao?.version}
								{global.app_info?.yao?.prversion &&
									`(${global.app_info?.yao?.prversion})`}
							</a>
						</span>
					</div>
				)}
			</div>

			{/* Developer Title */}
			<div className='w_100 flex justify_center align_center' style={{ marginTop: 32, marginBottom: 12 }}>
				<span style={{ fontSize: '16px', fontWeight: 500, color: 'var(--color_text)' }}>
					{is_cn ? '开发者' : 'Developer'}
				</span>
			</div>
			<div className='setting_items w_100 border_box flex flex_column mt_10'>
				<div className='setting_item w_100 border_box flex justify_between align_center'>
					<span className='name'>{is_cn ? '开发者' : 'Developer'}</span>
					<span className='desc'>{global.developer.name}</span>
				</div>

				{global.developer.info && (
					<div className='setting_item w_100 border_box flex justify_between align_center'>
						<span className='desc'>{global.developer.info}</span>
					</div>
				)}

				{global.developer.email && (
					<div className='setting_item w_100 border_box flex justify_between align_center'>
						<span className='name'>{is_cn ? '邮箱' : 'Email'}</span>
						<span className='desc'>{global.developer.email}</span>
					</div>
				)}

				{global.developer.homepage && (
					<div className='setting_item w_100 border_box flex justify_between align_center'>
						<span className='name'>{is_cn ? '主页' : 'Homepage'}</span>
						<span className='desc'>
							<a href={global.developer.homepage} target='_blank'>
								{global.developer.homepage}
							</a>
						</span>
					</div>
				)}
			</div>
		</div>
	)
}

export default new window.$app.Handle(Index).by(observer).by(window.$app.memo).get()
