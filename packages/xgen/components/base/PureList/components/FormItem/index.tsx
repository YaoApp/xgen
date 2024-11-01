import { useFocusWithin } from 'ahooks'
import { Col } from 'antd'
import { useRef } from 'react'
import { When } from 'react-if'

import { X } from '@/components'

import type { IPropsFormItem } from '../../types'

const Index = (props: IPropsFormItem) => {
	const { showLabel, item, __shadow_host_ref } = props
	const ref = useRef(null)
	const focus = useFocusWithin(ref)

	return (
		<Col className='relative' span={item.width} ref={ref}>
			<When condition={focus && !showLabel}>
				<span className='field_tooltip'>{item.name}</span>
			</When>
			<X
				type='edit'
				name={item.edit.type}
				__shadow='pure-list'
				__shadow_host_ref={__shadow_host_ref}
				props={{
					...item.edit.props,
					__namespace: '',
					__primary: '',
					__type: item.edit.type,
					__bind: item.bind,
					__name: item.name,
					__data_item: null,
					style: { width: '100%' }
				}}
			></X>
		</Col>
	)
}

export default window.$app.memo(Index)
