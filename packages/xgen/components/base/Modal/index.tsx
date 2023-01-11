import { useMemoizedFn } from 'ahooks'
import { useMemo, useState } from 'react'

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
	const width = config.width || 900

	const { parent_container, parent_width } = useMemo(() => {
		if (!config.isRef) return {}
		if (namespace.indexOf('/') === -1) return {}

		const raw_width = config.width || 900
		const width = typeof raw_width === 'number' ? `${raw_width}px` : raw_width
		const paths = namespace.split('/')

		paths.pop()

		const parent_id = `${paths.join('/')}=>__modal_container`
		const parent_container = document.querySelector(`[id='${parent_id}'] .xgen-modal`)! as HTMLDivElement
		const parent_width = getComputedStyle(parent_container).getPropertyValue('width')

		parent_container.style.setProperty('margin', 'unset')
		parent_container.style.setProperty('margin-left', `calc((100vw - ${parent_width} - ${width}) / 2)`)

		return { parent_container, parent_width }
	}, [namespace, config])

	const onBack = useMemoizedFn(() => {
		setVisible(false)

		if (parent_container) {
			parent_container.style.setProperty('margin', '0 auto')

			document.getElementById(`${namespace}=>__modal_container`)!.remove()

			return
		}

		setTimeout(() => {
			document.getElementById(`${namespace}=>__modal_container`)!.remove()
		}, 300)
	})

	const props_modal_wrap: Omit<IPropsModalWrap, 'children'> = {
		width: typeof width === 'string' ? width : `${width}px`,
		visible,
		mask: !config.isRef,
		parent_width,
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
