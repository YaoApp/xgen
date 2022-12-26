import { Col } from 'antd'
import { useMemo } from 'react'

import { X } from '@/components'

import type { IPropsFormItem } from '../types'

const Index = (props: IPropsFormItem) => {
	const { namespace, primary, type, item } = props

	const disabled_props = useMemo(() => {
		if (type === 'view') return {}

		const disabled = item.edit.props?.disabled

		if (typeof disabled === 'undefined') return {}
		if (typeof disabled === 'string') return { disabled: disabled === 'true' }

		return { disabled }
	}, [type, item.edit.props?.disabled])

	return (
		<Col span={item.width}>
			<X
				type='edit'
				name={item.edit.type}
				props={{
					...item.edit.props,
					...disabled_props,
					__namespace: namespace,
					__primary: primary,
					__type: type,
					__bind: item.bind,
					__name: item.name
				}}
			></X>
		</Col>
	)
}

export default window.$app.memo(Index)
