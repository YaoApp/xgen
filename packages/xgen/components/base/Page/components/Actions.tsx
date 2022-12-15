import { Tooltip } from 'antd'
import { Fragment } from 'react'

import { useAction } from '@/actions'
import { Icon } from '@/widgets'

import type { IPropsActions } from '../types'

const Index = (props: IPropsActions) => {
	const { actions } = props
	const onAction = useAction()

	return (
		<Fragment>
			{actions?.map((it, index) => (
				<Tooltip title={it.title} placement='bottom' key={index}>
					<a
						className='option_item cursor_point flex justify_center align_center transition_normal clickable'
						onClick={() =>
							onAction({
								namespace: '',
								primary: '',
								data_item: null,
								it
							})
						}
					>
						<Icon className='icon_option' name={it.icon} size={18}></Icon>
					</a>
				</Tooltip>
			))}
		</Fragment>
	)
}

export default window.$app.memo(Index)
