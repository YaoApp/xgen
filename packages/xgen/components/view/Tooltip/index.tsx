import { Tooltip } from 'antd'

import { Icon } from '@/widgets'

import type { Component } from '@/types'
import type { TooltipProps } from 'antd'

type IProps = Component.PropsViewComponent & TooltipProps & {}

const Index = (props: IProps) => {
	const { __value, title, onSave, ...rest_props } = props

	return (
		<Tooltip {...rest_props} title={title}>
			<div className='align_center' style={{ display: 'inline-flex' }}>
				{__value}
				<Icon className='ml_4' name='icon-info' size={15}></Icon>
			</div>
		</Tooltip>
	)
}

export default window.$app.memo(Index)
