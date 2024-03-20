import { useMemoizedFn } from 'ahooks'
import { useState } from 'react'
import { Else, If, Then } from 'react-if'

import { X } from '@/components'
import { AntdProvider, GlobalProvider } from '@/widgets'

import DrawerWrap from './DrawerWrap'
import ModalWrap from './ModalWrap'

import type { Component, Action } from '@/types'
import type { IPropsModalWrap } from './types'

export interface IProps {
	namespace: Component.Props['__namespace']
	id: number | string
	config: Action.OpenModal
}

const Index = (props: IProps) => {
	const { namespace, id, config } = props
	const [visible, setVisible] = useState(true)
	const width = config.width || 900

	const onBack = useMemoizedFn(() => {
		setVisible(false)

		setTimeout(() => {
			document.getElementById(`${namespace}=>__modal_container`)?.remove()
		}, 300)
	})

	const props_modal_wrap: Omit<IPropsModalWrap, 'children'> = {
		width: typeof width === 'string' ? width : `${width}px`,
		visible,
		config,
		onBack
	}

	if (config.Form) {
		const content = (
			<GlobalProvider>
				<X
					type='base'
					name='Form'
					props={{
						parent: 'Modal',
						parentNamespace: namespace,
						model: config.Form.model,
						id,
						form: { type: config.Form.type },
						onBack
					}}
				></X>
			</GlobalProvider>
		)

		return (
			<AntdProvider>
				<If condition={!!config.byDrawer}>
					<Then>
						<DrawerWrap {...props_modal_wrap}>{content}</DrawerWrap>
					</Then>
					<Else>
						<ModalWrap {...props_modal_wrap}>{content}</ModalWrap>
					</Else>
				</If>
			</AntdProvider>
		)
	}

	return null
}

export default window.$app.memo(Index)
