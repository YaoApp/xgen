import { Col, Tabs } from 'antd'

import RowItem from './RowItem'

import type { IPropsTabsItem, IPropsRowItem } from '../types'

const { TabPane } = Tabs

const Index = (props: IPropsTabsItem) => {
	const { namespace, primary, data, item, disabled } = props

	const props_row_item: Omit<IPropsRowItem, 'columns'> = {
		namespace,
		primary,
		data,
		disabled
	}

	return (
		<Col span={item.width}>
			<Tabs className='w_100' animated>
				{item.tabs.map((it, idx: number) => (
					<TabPane tab={it.title} key={idx} forceRender>
						<RowItem {...props_row_item} columns={it.columns}></RowItem>
					</TabPane>
				))}
			</Tabs>
		</Col>
	)
}

export default window.$app.memo(Index)
