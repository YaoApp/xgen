import { Tooltip } from 'antd'
import clsx from 'clsx'
import { observer } from 'mobx-react-lite'

import { Icon } from '@/components'
import { useGlobal } from '@/context/app'

import Form from '../Form'
import Left from '../Left'
import styles from './index.less'

const Index = () => {
	const global = useGlobal()
	const is_dark = global.theme == 'dark'

	return (
		<div className={clsx([styles._local, 'w_100vw h_100vh flex '])}>
			<Left></Left>
			<div className='right_wrap h_100 border_box flex flex_column align_center justify_center relative'>
				<div className='top_wrap absolute top_0 left_0 w_100 border_box flex justify_between align_center'>
					<Tooltip title='普通用户登录' placement='right'>
						<div className='user_login_wrap action_wrap flex justify_center align_center cursor_point'>
							<Icon name='icon-user' size={18}></Icon>
						</div>
					</Tooltip>
					<div
						className='theme_change_wrap action_wrap flex justify_center align_center cursor_point'
						onClick={() => global.setTheme(is_dark ? 'light' : 'dark')}
					>
						<Icon
							name={`icon-${is_dark ? 'sun' : 'moon'}`}
							size={18}
						></Icon>
					</div>
				</div>
				<div className='title_wrap relative'>
					<span className='title'>登录</span>
					<span className='user_type absolute white'>Admin</span>
				</div>
				<Form></Form>
				<div className='copyright w_100 absolute flex justify_center'>
					<span>由</span>
					<a href='https://www.iqka.com/' target='_blank'>
						象传智慧
					</a>
					<span>提供技术支持</span>
				</div>
			</div>
		</div>
	)
}

export default new window.$app.Handle(Index).by(observer).by(window.$app.memo).get()
