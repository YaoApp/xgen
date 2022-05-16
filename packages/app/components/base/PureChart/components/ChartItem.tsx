import { Col } from 'antd'

import { X } from '@/components'
import { Card } from '@/widgets'

import type { IPropsChartItem } from '../types'

const Index = (props: IPropsChartItem) => {
	const { item, data } = props

	return (
		<Col span={item.width}>
			<Card title={item.view.type !== 'Number' ? item.name : ''}>
				<X
					type='chart'
					name={item.view.type}
					props={{
						...item.view.props,
						data: data[item.bind],
						__bind: item.bind,
						__name: item.name
					}}
				></X>
			</Card>
		</Col>
	)
}

export default window.$app.memo(Index)
