import { Tooltip } from 'antd'
import clsx from 'clsx'
import { observer } from 'mobx-react-lite'
import { When } from 'react-if'

import { useIntl } from '@/hooks'
import { toFirstUpperCase } from '@/utils/filter'
import { Icon } from '@/widgets'
import { Link } from '@umijs/max'

import { Form, ThirdPartyLogin } from './components'

import type { IPropsCommon, IPropsForm } from '@/pages/login/types'

const Index = ({ x, type }: IPropsCommon) => {
	const messages = useIntl()
	const is_dark = x.global.theme == 'dark'

	const props_form: IPropsForm = {
		code: x.captcha.content,
		loading: x.loading.login,
		getCaptcha: x.getCaptcha,
		onFinish: x.onFinish
	}

	return (
		<div className='right_wrap h_100 border_box flex flex_column align_center justify_center relative'>
			<div className='top_wrap absolute top_0 left_0 w_100 border_box flex justify_between align_center'>
				<Tooltip
					title={type === 'admin' ? messages.login.user_login_tip : messages.login.admin_login_tip}
					placement='right'
				>
					<Link
						className={clsx([
							'user_login_wrap action_wrap flex justify_center align_center cursor_point',
							!x.global.app_info.login?.user && 'disabled'
						])}
						to={`/login/${type === 'admin' ? 'user' : 'admin'}`}
					>
						<Icon name={`icon-user${type === 'admin' ? 's' : ''}`} size={18}></Icon>
					</Link>
				</Tooltip>
				<div
					className='theme_change_wrap action_wrap flex justify_center align_center cursor_point'
					onClick={() => x.global.setTheme(is_dark ? 'light' : 'dark')}
				>
					<Icon name={`icon-${is_dark ? 'sun' : 'moon'}`} size={18}></Icon>
				</div>
			</div>
			<div className='title_wrap relative'>
				<span className='title'>{messages.login.title}</span>
				<span className='user_type absolute white'>{toFirstUpperCase(type)}</span>
			</div>
			<Form {...props_form}></Form>
			<When condition={x.global.app_info?.login?.admin?.thirdPartyLogin?.length}>
				<ThirdPartyLogin items={x.global.app_info?.login?.admin?.thirdPartyLogin}></ThirdPartyLogin>
			</When>
		</div>
	)
}

export default new window.$app.Handle(Index).by(observer).by(window.$app.memo).get()
