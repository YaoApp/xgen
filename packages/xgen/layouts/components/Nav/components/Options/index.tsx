import { useMemoizedFn } from 'ahooks'
import { Popover } from 'antd'
import clsx from 'clsx'
import NiceAvatar from 'react-nice-avatar'

import { useIntl } from '@/hooks'

import NavItem from '../NavItem'
import UserModalContent from '../UserModalContent'
import styles from './index.less'

import type { IPropsOptions, IPropsUserModalContent } from '@/layouts/types'

const Index = (props: IPropsOptions) => {
	const { items, current_nav, show_name, in_setting, avatar, user, setAvatar, setInSetting } = props
	const messages = useIntl()

	const Avatar = (
		<NiceAvatar
			className='avatar cursor_point transition_normal'
			style={{ width: 40, height: 40 }}
			{...avatar}
		/>
	)

	const onClick = useMemoizedFn(() => setInSetting(true))

	const props_user_modal_content: IPropsUserModalContent = {
		user,
		locale_messages: messages,
		Avatar,
		setAvatar
	}

	return (
		<div id='setting_items_wrap' className={clsx([styles._local, 'w_100 flex flex_column'])}>
			<div className='nav_items w_100 flex flex_column align_center'>
				{items?.map((item, index) => (
					<NavItem
						item={item}
						active={in_setting && current_nav === index}
						onClick={onClick}
						show_name={show_name}
						key={index}
					></NavItem>
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
