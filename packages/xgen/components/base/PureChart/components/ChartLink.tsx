import { Tooltip } from 'antd'

import { Icon } from '@/widgets'
import { Link } from '@umijs/max'

import type { IPropsChartLink } from '../types'

const Index = (props: IPropsChartLink) => {
	const { link_tooltip, link } = props

	return (
		<Tooltip title={link_tooltip}>
			<Link className='chart_link flex justify_center align_center' to={link}>
				<Icon name='icon-arrow-right' size={12}></Icon>
			</Link>
		</Tooltip>
	)
}

export default window.$app.memo(Index)
