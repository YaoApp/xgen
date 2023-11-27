import { Col } from 'antd'

import { X } from '@/components'
import { Card } from '@/widgets'
import { useIntl } from '@umijs/max'

import { Message } from '../locales'
import ChartLink from './ChartLink'

import type { IPropsChartItem } from '../types'

const Index = (props: IPropsChartItem) => {
	const { item, data } = props
	const { cardStyle, ...view_props } = item.view.props
	const { locale } = useIntl()
	const locale_messages = Message(locale)

	return (
		<Col span={item.width}>
			<Card
				title={item.name}
				options={
					item.link && (
						<ChartLink link_tooltip={locale_messages.link_tooltip} link={item.link}></ChartLink>
					)
				}
				style={cardStyle}
			>
				<X
					type='chart'
					name={item.view.type}
					props={{
						...view_props,
						data: data[item.bind],
						__bind: item.bind,
						__name: item.name
					}}
				></X>
				{item.refer && (
					<div className='refer_wrap w_100'>
						<X
							type='chart'
							name={item.refer.type}
							props={{
								...item.refer.props,
								data: data[item.bind],
								__bind: item.bind,
								__name: item.name
							}}
						></X>
					</div>
				)}
			</Card>
		</Col>
	)
}

export default window.$app.memo(Index)
