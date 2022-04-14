import { Row } from 'antd'

import FormItem from './FormItem'
import TabsItem from './TabsItem'

import type { IPropsRowItem, IPropsTabsItem, IPropsFormItem } from '../types'

const Index = (props: IPropsRowItem) => {
	const { namespace, primary, data, columns } = props

	const props_tabs_item: Omit<IPropsTabsItem, 'item'> = {
		namespace,
		primary,
		data
	}

	const props_form_item: Omit<IPropsFormItem, 'item'> = {
		namespace,
		primary,
		data
	}

	return (
		<Row gutter={24} wrap={true}>
			{columns.map((item, index: number) => {
				if ('tabs' in item) {
					return (
						<TabsItem
							{...props_tabs_item}
							item={item}
							key={index}
						></TabsItem>
					)
				} else {
					return (
						<FormItem
							{...props_form_item}
							item={item}
							key={index}
						></FormItem>
					)
				}
			})}
		</Row>
	)
}

export default window.$app.memo(Index)
