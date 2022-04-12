import { historyBack, historyPush, openModal } from './actions/Common'
import { delete as tableDelete, save } from './actions/Table'

import type { Component, Action } from '@/types'

export interface OnAction {
	namespace: Component.Props['__namespace']
	primary: Component.Props['__primary']
	data_item: Component.Props['__data_item']
	it: Action.Props
}

const onAction = ({ namespace, primary, data_item, it }: OnAction) => {
	if (it.action?.['Common.openModal']) {
		openModal({ namespace, primary, it })
	}

	if (it.action?.['Common.historyPush']) {
		historyPush({ data_item, action: it.action['Common.historyPush'] })
	}

	if (it.action?.['Common.historyBack']) {
		historyBack()
	}

	if (it.action?.['Table.save']) {
		save({ namespace, primary, data_item, it })
	}

	if (it.action?.['Table.delete']) {
		tableDelete({ namespace, primary, data_item, it })
	}
}

export default () => onAction
