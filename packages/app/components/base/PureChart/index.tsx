import { Row } from 'antd'

import ChartItem from './components/ChartItem'
import styles from './index.less'

import type { IPropsPureChart } from './types'

const Index = (props: IPropsPureChart) => {
	const { data, columns } = props

	return (
		<Row className={styles._local} gutter={16} wrap style={{ margin: 0 }}>
			{columns.map((item, index: number) => (
				<ChartItem {...{ item, data }} key={index}></ChartItem>
			))}
		</Row>
	)
}

export default window.$app.memo(Index)
