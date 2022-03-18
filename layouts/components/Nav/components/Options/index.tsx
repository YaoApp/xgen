import { Badge, Modal, Popover } from 'antd'
import clsx from 'clsx'
import { observer } from 'mobx-react-lite'
import { useState } from 'react'
import NiceAvatar from 'react-nice-avatar'

import { Icon } from '@/components'
import { useIntl } from '@umijs/max'

import SettingModalContent from '../SettingModalContent'
import UserModalContent from '../UserModalContent'
import styles from './index.less'

import type { ModalProps } from 'antd'
import type { GlobalModel } from '@/context/app'

import type { IPropsOptions } from '@/layouts/types'
import type { IProps as IPropsSettingModalContent } from '../SettingModalContent'
import type { IProps as IPropsUserModalContent } from '../UserModalContent'

const Index = (props: IPropsOptions) => {
	const { theme, avatar, app_info, user, setTheme, getUserMenu } = props
	const intl = useIntl()
	const { locale } = intl
	const locale_messages: GlobalModel['locale_messages'] = intl.messages
	const [visible_setting_modal, setVisibleSettingModal] = useState(false)

	const Avatar = (
		<NiceAvatar
			className='avatar cursor_point transition_normal'
			style={{ width: 40, height: 40 }}
			{...avatar}
		/>
	)

	const props_setting_modal: ModalProps = {
		visible: visible_setting_modal,
		title: locale_messages.layout.setting.title,
		wrapClassName: 'custom_modal',
		destroyOnClose: true,
		getContainer: false,
		maskClosable: true,
		centered: true,
		footer: null,
		onCancel: () => setVisibleSettingModal(false)
	}

	const props_user_modal_content: IPropsUserModalContent = {
		user,
		text_logout: locale_messages.layout.logout,
		Avatar
	}

	const props_setting_modal_content: IPropsSettingModalContent = {
		locale_messages: locale_messages,
		locale,
		theme,
		setTheme,
		getUserMenu
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
					className='nav_item w_100 flex justify_center align_center clickable'
					onClick={() => setVisibleSettingModal(true)}
				>
					<Icon name='icon-settings' size={20}></Icon>
				</div>
			)}
			<Modal {...props_setting_modal}>
				<SettingModalContent {...props_setting_modal_content}></SettingModalContent>
			</Modal>
			<Popover
				overlayClassName='popover_user_wrap'
				trigger='click'
				placement='rightTop'
				align={{ offset: [24, -6] }}
				content={
					<UserModalContent {...props_user_modal_content}></UserModalContent>
				}
				getPopupContainer={() =>
					document.getElementById('option_item') as HTMLElement
				}
			>
				<div
					id='option_item'
					className='option_item flex justify_center align_center'
				>
					{Avatar}
				</div>
			</Popover>
		</div>
	)
}

export default new window.$app.Handle(Index).by(observer).by(window.$app.memo).get()
