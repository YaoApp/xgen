import { Tooltip } from 'antd'

import { Icon } from '@/widgets'
import { history } from '@umijs/max'

import type { Action } from '../types'

const Index = (props: Action) => {
	const { title, props: props_action, icon } = props

	const onAction = () => {
		if (props_action.type === 'history.push') {
			history.push(props_action.payload)
		}
	}

	return (
		<Tooltip title={title} placement='bottom'>
			<a
				className='option_item cursor_point flex justify_center align_center transition_normal clickable'
				onClick={onAction}
			>
				<Icon className='icon_option' name={icon} size={18}></Icon>
			</a>
		</Tooltip>
	)
}

export default window.$app.memo(Index)
