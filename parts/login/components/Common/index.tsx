import { Tooltip } from 'antd'
import clsx from 'clsx'
import { observer } from 'mobx-react-lite'

import { Icon } from '@/components'
import { useGlobal } from '@/context/app'
import { toFirstUpperCase } from '@/utils/filter'
import { Link, useIntl } from '@umijs/pro'

import Form from './components/Form'
import Left from './components/Left'
import Sns from './components/Sns'
import styles from './index.less'

import type { IPropsCommon, IPropsForm } from '../../types'

const Index = ({ x, type }: IPropsCommon) => {
	const global = useGlobal()
	const is_dark = global.theme == 'dark'
	const { messages, locale } = useIntl()
	const is_cn = locale === 'zh-CN'

	const props_form: IPropsForm = {
		code: x.captcha.content,
		feishu: global.app_info.login?.feishu,
		loading: x.loading.login,
		getCaptcha: x.getCaptcha,
		onFinish: x.onFinish
	}

	return (
		<div className={clsx([styles._local, 'w_100vw h_100vh flex '])}>
			<Left></Left>
			<div className='right_wrap h_100 border_box flex flex_column align_center justify_center relative'>
				<div className='top_wrap absolute top_0 left_0 w_100 border_box flex justify_between align_center'>
					<Tooltip title={messages.login.user_login_tip} placement='right'>
						<Link
							className='user_login_wrap action_wrap flex justify_center align_center cursor_point'
							to='/login/user'
						>
							<Icon name='icon-user' size={18}></Icon>
						</Link>
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
					<span className='title'>{messages.login.title}</span>
					<span className='user_type absolute white'>
						{toFirstUpperCase(type)}
					</span>
				</div>
				<Form {...props_form}></Form>
				{is_cn ? (
					<div className='copyright w_100 absolute flex justify_center'>
						<span>由</span>
						<a href='https://www.iqka.com/' target='_blank'>
							象传智慧
						</a>
						<span>提供技术支持</span>
					</div>
				) : (
					<Sns></Sns>
				)}
			</div>
		</div>
	)
}

export default new window.$app.Handle(Index).by(observer).by(window.$app.memo).get()
