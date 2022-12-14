import { useMemoizedFn } from 'ahooks'
import { useState } from 'react'

import { X } from '@/components'

import ModalWrap from './ModalWrap'

import type { Component, Action } from '@/types'
import type { IPropsModalWrap } from './types'

export interface IProps {
	namespace: Component.Props['__namespace']
	id: number
	config: Action.OpenModal
}

const Index = (props: IProps) => {
	const { namespace, id, config } = props
	const [visible, setVisible] = useState(true)

	const onBack = useMemoizedFn(() => {
		setVisible(false)

		document.getElementById(`${namespace}=>__modal_container`)!.remove()
	})

	const props_modal_wrap: Omit<IPropsModalWrap, 'children'> = {
		width: config.width,
		visible,
		onBack
	}

	if (config.Form) {
		return (
			<ModalWrap {...props_modal_wrap}>
				<X
					type='base'
					name='Form'
					props={{
						parent: 'Modal',
						model: config.Form.model,
						id,
						form: { type: config.Form.type },
						onBack
					}}
				></X>
			</ModalWrap>
		)
	}

	return null
}

export default Index
