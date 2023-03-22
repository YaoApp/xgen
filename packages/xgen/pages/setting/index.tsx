import { Switch } from 'antd'
import clsx from 'clsx'
import { observer } from 'mobx-react-lite'

import { useGlobal } from '@/context/app'
import { useIntl } from '@/hooks'
import { getLocale, setLocale } from '@umijs/max'

import styles from './index.less'

const Index = () => {
	const global = useGlobal()
	const messages = useIntl()
	const locale = getLocale()
	const is_cn = locale === 'zh-CN'

	return (
		<div className={clsx([styles._local, 'w_100 border_box flex flex_column'])}>
			<div className='setting_items w_100 border_box flex flex_column'>
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
