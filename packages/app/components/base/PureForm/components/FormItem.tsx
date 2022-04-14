import { Col } from 'antd'

import { X } from '@/components'

import type { IPropsFormItem } from '../types'

const Index = (props: IPropsFormItem) => {
	const { namespace, primary, data, item } = props

	return (
		<Col span={item.width}>
			<X
				type='edit'
				name={item.edit.type}
				props={{
					...item.edit.props,
					__namespace: namespace,
					__primary: primary,
					__bind: item.bind,
					__name: item.name,
					__data_item: data
				}}
			></X>
		</Col>
	)
}

export default window.$app.memo(Index)
