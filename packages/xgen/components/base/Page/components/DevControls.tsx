import { Tooltip } from 'antd'
import { Fragment } from 'react'
import { Icon } from '@/widgets'

import { useGlobal } from '@/context/app'
import { getLocale } from '@umijs/max'
import { IDevControls } from '../types'

const Index = (props: IDevControls) => {
	const is_cn = getLocale() === 'zh-CN'
	const { enableXterm, enableAIEdit } = props
	return (
		<Fragment>
			{enableXterm && (
				<Tooltip title={is_cn ? '打开终端' : 'Open Terminal'} placement='bottom' key={0}>
					<a
						className='option_item cursor_point flex justify_center align_center transition_normal clickable'
						onClick={() => window.$app.Event.emit('app/setSidebarVisible', false)}
					>
						<Icon className='icon_option' name='icon-terminal' size={18}></Icon>
					</a>
				</Tooltip>
			)}

			{enableAIEdit && (
				<Tooltip title={is_cn ? '使用AI编辑' : 'Edit with AI'} placement='bottom' key={2}>
					<a
						className='option_item cursor_point flex justify_center align_center transition_normal clickable'
						onClick={() => window.$app.Event.emit('app/setSidebarVisible', true)}
					>
						<Icon className='icon_option' name='icon-message-square' size={18}></Icon>
					</a>
				</Tooltip>
			)}
		</Fragment>
	)
}

export default window.$app.memo(Index)
