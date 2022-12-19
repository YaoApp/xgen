import { Col } from 'antd'

import ChartRender from './ChartRender'
import FormRender from './FormRender'
import TableRender from './TableRender'

import type { IPropsItem } from '../types'

const Index = (props: IPropsItem) => {
	const { item, data } = props

	if ('rows' in item) {
		return (
			<Col span={item.width} style={{ marginBottom: 16 }}>
				<div className='flex flex_column'>
					{item.rows.map((it, index) => (
						<Index item={it} data={data} key={index}></Index>
					))}
				</div>
			</Col>
		)
	}

	if (item.view.type.startsWith('chart/')) {
		if (item.width) {
			return (
				<Col span={item.width}>
					<ChartRender item={item} data={data[item.bind]}></ChartRender>
				</Col>
			)
		}

		return <ChartRender item={item} data={data[item.bind]}></ChartRender>
	}

	if (item.view.type === 'base/Table') {
		if (item.width) {
			return (
				<Col span={item.width}>
					<TableRender item={item}></TableRender>
				</Col>
			)
		}

		return <TableRender item={item}></TableRender>
	}

	if (item.view.type === 'base/Form') {
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
