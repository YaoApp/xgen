import { Col } from 'antd'

import ChartRender from './ChartRender'
import FormRender from './FormRender'
import TableRender from './TableRender'

import type { IPropsItem } from '../types'

const Index = (props: IPropsItem) => {
	const { item } = props

	if ('rows' in item) {
		return (
			<Col span={item.width} style={{ marginBottom: 16 }}>
				<div className='flex flex_column'>
					{item.rows.map((it, index) => (
						<Index item={it} key={index}></Index>
					))}
				</div>
			</Col>
		)
	}

	if (item.type.startsWith('chart/')) {
		if (item.width) {
			return (
				<Col span={item.width}>
					<ChartRender item={item}></ChartRender>
				</Col>
			)
		}

		return <ChartRender item={item}></ChartRender>
	}

	if (item.type === 'base/Table') {
		if (item.width) {
			return (
				<Col span={item.width}>
					<TableRender item={item}></TableRender>
				</Col>
			)
		}

		return <TableRender item={item}></TableRender>
	}

	if (item.type === 'base/Form') {
		if (item.width) {
			return (
				<Col span={item.width} style={{ marginBottom: 16 }}>
					<FormRender item={item}></FormRender>
				</Col>
			)
		}

		return <FormRender item={item}></FormRender>
	}

	return null
}

export default window.$app.memo(Index)
