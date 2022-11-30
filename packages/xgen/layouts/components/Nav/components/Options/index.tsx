import { Popover, Tooltip } from 'antd'
import clsx from 'clsx'
import NiceAvatar from 'react-nice-avatar'

import { useIntl } from '@/hooks'
import { Icon } from '@/widgets'
import { Link } from '@umijs/max'

import UserModalContent from '../UserModalContent'
import styles from './index.less'

import type { IPropsOptions, IPropsUserModalContent } from '@/layouts/types'

const Index = (props: IPropsOptions) => {
	const { items, current_nav, in_setting, avatar, user, setAvatar, setCurrentNav, setInSetting } = props
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
		<div id='setting_items_wrap' className={clsx([styles._local, 'w_100 flex flex_column'])}>
			<div className='nav_items w_100 flex flex_column align_center'>
				{items.map((item, index) => (
					<Tooltip title={item.name} placement='right' key={index}>
						<Link
							className={clsx([
								'nav_item w_100 flex justify_center align_center clickable',
								current_nav === index && in_setting ? 'active' : ''
							])}
							to={item.path}
							onClick={() => {
								setCurrentNav(index)
								setInSetting(true)
							}}
						>
							<Icon name={item.icon} size={20}></Icon>
						</Link>
					</Tooltip>
				))}
			</div>
			<Popover
				overlayClassName='popover_user_wrap'
				trigger='click'
				placement='rightTop'
				align={{ offset: [20, -6] }}
				content={<UserModalContent {...props_user_modal_content}></UserModalContent>}
				getPopupContainer={() => document.getElementById('user_modal_wrap') as HTMLElement}
			>
				<div id='user_modal_wrap' className='user_item flex justify_center align_center'>
					{Avatar}
				</div>
			</Popover>
		</div>
	)
}

export default window.$app.memo(Index)
