import { Col } from 'antd'
import { toJS } from 'mobx'

import { X } from '@/components'

import type { IPropsFormItem } from '../types'

const Index = (props: IPropsFormItem) => {
	const { namespace, primary, type, data, item } = props

	return (
		<Col span={item.width}>
			<X
				type='edit'
				name={item.edit.type}
				props={{
					...toJS(item.edit.props),
					__namespace: namespace,
					__primary: primary,
					__type: type,
					__bind: item.bind,
					__name: item.name,
					__data_item: toJS(data)
				}}
			></X>
		</Col>
	)
}

export default window.$app.memo(Index)
