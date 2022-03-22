import { Tooltip } from 'antd'

import { Icon } from '@/components'
import { history } from '@umijs/max'

import type { Action } from '../types'

const Index = (props: Action) => {
	const { title, action, payload, icon, onClick } = props

	const onAction = () => {
		if (action === 'history.push') {
			history.push(payload)
		}
	}

	return (
		<Tooltip title={title} placement='bottom'>
			<a
				className='option_item cursor_point flex justify_center align_center transition_normal clickable'
				onClick={() => {
					if (action) onAction()
					if (onClick) onClick()
				}}
			>
				<Icon className='icon_option' name={icon} size={18}></Icon>
			</a>
		</Tooltip>
	)
}

export default window.$app.memo(Index)
