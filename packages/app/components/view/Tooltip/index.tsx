import { Tooltip } from 'antd'

import { Icon } from '@/widgets'
import { getDeepValue } from '@yaoapp/utils'

import type { Component } from '@/types'
import type { TooltipProps } from 'antd'

type IProps = Component.PropsViewComponent & TooltipProps & {}

const Index = (props: IProps) => {
	const { __value, __data_item } = props

	const title = getDeepValue(props.title as string, __data_item)

	return (
		<Tooltip {...props} title={title}>
			<div className='align_center' style={{ display: 'inline-flex' }}>
				{__value}
				<Icon className='ml_4' name='icon-info' size={15}></Icon>
			</div>
		</Tooltip>
	)
}

export default window.$app.memo(Index)
