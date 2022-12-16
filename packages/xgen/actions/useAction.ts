import { handleActions } from '@/actions/utils'
import Flow from '@yaoapp/actionflow'

import type { Component, Action } from '@/types'

export interface OnAction {
	namespace: Component.Props['__namespace']
	primary: Component.Props['__primary']
	data_item: any
	it: Action.Props
}

const onAction = ({ namespace, primary, data_item, it }: OnAction) => {
	const actions = handleActions({ namespace, primary, data_item, it })

	new Flow().init(actions)
}

export default () => onAction
