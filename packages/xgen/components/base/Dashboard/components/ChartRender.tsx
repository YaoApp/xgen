import { X } from '@/components'
import { Card } from '@/widgets'

import { useChartData } from '../hooks'

import type { IPropsChartRender } from '../types'
import type { Dashboard } from '@/types'

const Index = (props: IPropsChartRender) => {
	const { item } = props
	const bind = item.bind as Dashboard.ChartBind
	const data = useChartData(bind.dataSource)

	if (!data) return null

	return (
		<Card title={item.name} style={item?.cardStyle} ignoreMarginBottom>
			<X
				type='chart'
				name={item.type.split('/')[1]}
				props={{
					...item.props,
					data,
					__bind: item.bind,
					__name: item.name
				}}
			></X>
		</Card>
	)
}

export default window.$app.memo(Index)
