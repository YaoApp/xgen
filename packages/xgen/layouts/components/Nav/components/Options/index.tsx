import { Badge, Popover } from 'antd'
import clsx from 'clsx'
import NiceAvatar from 'react-nice-avatar'

import { useIntl } from '@/hooks'
import { Icon } from '@/widgets'

import UserModalContent from '../UserModalContent'
import styles from './index.less'

import type { IPropsOptions, IPropsUserModalContent } from '@/layouts/types'

const Index = (props: IPropsOptions) => {
	const { avatar, app_info, user, in_setting, setAvatar, setInSetting } = props
	const messages = useIntl()

	const Avatar = (
		<NiceAvatar
			className='avatar cursor_point transition_normal'
			style={{ width: 40, height: 40 }}
			{...avatar}
		/>
	)

	const props_user_modal_content: IPropsUserModalContent = {
		user,
		locale_messages: messages,
		Avatar,
		setAvatar
	}

	return (
		<div className={clsx([styles._local, 'flex flex_column align_center'])}>
			{!app_info?.optional?.hideNotification && (
				<div className='nav_item w_100 flex justify_center align_center clickable'>
					<Badge dot offset={[-4, 2]}>
						<Icon name='icon-bell' size={20}></Icon>
					</Badge>
				</div>
			)}
			{!app_info?.optional?.hideSetting && (
				<div
					className={clsx(
						'nav_item w_100 flex justify_center align_center clickable',
						in_setting && 'active'
					)}
					onClick={() => setInSetting(true)}
				>
					<Icon name='icon-settings' size={20}></Icon>
				</div>
			)}
			<Popover
				overlayClassName='popover_user_wrap'
				trigger='click'
				placement='rightTop'
				align={{ offset: [20, -6] }}
				content={<UserModalContent {...props_user_modal_content}></UserModalContent>}
				getPopupContainer={() => document.getElementById('option_item') as HTMLElement}
			>
				<div id='option_item' className='option_item flex justify_center align_center'>
					{Avatar}
				</div>
			</Popover>
		</div>
	)
}

export default window.$app.memo(Index)
