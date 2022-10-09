import { Col, Tabs } from 'antd'

import RowItem from './RowItem'

import type { IPropsTabsItem, IPropsRowItem } from '../types'

const Index = (props: IPropsTabsItem) => {
	const { namespace, primary, type, data, item } = props

	const props_row_item: Omit<IPropsRowItem, 'columns'> = {
		namespace,
		primary,
		type,
		data
	}

	return (
		<Col span={item.width}>
			<Tabs
				className='w_100'
				animated
				items={item.tabs.map((it, idx) => ({
					label: it.title,
					key: it.title! + idx,
					children: <RowItem {...props_row_item} columns={it.columns}></RowItem>
				}))}
			></Tabs>
		</Col>
	)
}

export default window.$app.memo(Index)
