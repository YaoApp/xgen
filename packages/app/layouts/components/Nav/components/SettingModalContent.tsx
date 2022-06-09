import { Button, Switch } from 'antd'

import { ReloadOutlined } from '@ant-design/icons'
import { setLocale } from '@umijs/max'

import type { IPropsSettingModalContent } from '@/layouts/types'

const Index = (props: IPropsSettingModalContent) => {
	const { locale_messages, locale, theme, setTheme, getUserMenu } = props
	const is_cn = locale === 'zh-CN'

	return (
		<div className='setting_modal w_100 border_box flex flex_column'>
			<div className='setting_items w_100 border_box flex flex_column'>
				<div className='setting_item w_100 border_box flex justify_between align_center'>
					<div className='flex flex_column'>
						<span className='name'>
							{locale_messages.layout.setting.update_menu.title}
						</span>
						<span className='desc'>
							{locale_messages.layout.setting.update_menu.desc}
						</span>
					</div>
					<Button
						className='btn_update'
						icon={<ReloadOutlined size={15}></ReloadOutlined>}
						type='primary'
						ghost
						onClick={() => getUserMenu()}
					>
						<span>
							{locale_messages.layout.setting.update_menu.btn_text}
						</span>
					</Button>
				</div>
				<div className='setting_item w_100 border_box flex justify_between align_center'>
					<span className='name'>
						{locale_messages.layout.setting.language.title}
					</span>
					<Switch
						checkedChildren='EN'
						unCheckedChildren='中文'
						checked={!is_cn}
						onChange={(v) => setLocale(v ? 'en-US' : 'zh-CN')}
					/>
				</div>
				<div className='setting_item w_100 border_box flex justify_between align_center'>
					<span className='name'>
						{locale_messages.layout.setting.theme.title}
					</span>
					<Switch
						checkedChildren='light'
						unCheckedChildren='dark'
						checked={theme === 'light'}
						onChange={(v) => setTheme(v ? 'light' : 'dark')}
					/>
				</div>
			</div>
		</div>
	)
}

export default window.$app.memo(Index)
