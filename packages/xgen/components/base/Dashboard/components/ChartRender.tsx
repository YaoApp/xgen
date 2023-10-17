import { X } from '@/components'
import { Card } from '@/widgets'

import type { IPropsChartRender } from '../types'

const Index = (props: IPropsChartRender) => {
	const { item, data = [] } = props

	if (data === null || data === undefined) return null

	return (
		<Card title={item.name} style={item.view.props?.cardStyle} ignoreMarginBottom>
			<X
				type='chart'
				name={item.view.type.split('/')[1]}
				props={{
					...item.view.props,
					data,
					__bind: item.bind,
					__name: item.name
				}}
			></X>
		</Card>
	)
}

export default window.$app.memo(Index)
