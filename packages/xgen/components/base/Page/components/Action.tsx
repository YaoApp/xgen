import { Tooltip } from 'antd'

import { useCommonAction } from '@/hooks'
import { Icon } from '@/widgets'

import type { Action } from '@/types'

const Index = (props: Action.Props) => {
	const { title, icon } = props
	const onAction = useCommonAction()

	return (
		<Tooltip title={title} placement='bottom'>
			<a
				className='option_item cursor_point flex justify_center align_center transition_normal clickable'
				onClick={() => onAction({ it: props })}
			>
				<Icon className='icon_option' name={icon} size={18}></Icon>
			</a>
		</Tooltip>
	)
}

export default window.$app.memo(Index)
