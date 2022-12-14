import { closeModal, historyBack, historyPush, openModal } from './actions/Common'
import { delete as FormDelete, save as FormSave } from './actions/Form'
import { delete as tableDelete, save as TableSave } from './actions/Table'
import { Service, Studio } from './actions/Yao'

import type { Component, Action } from '@/types'

export interface OnAction {
	namespace: Component.Props['__namespace']
	primary: Component.Props['__primary']
	data_item: any
	it: Action.Props
}

const onAction = ({ namespace, primary, data_item, it }: OnAction) => {
	if (it.action.length === 1) {
		const action = it.action[0]
		const { type, payload } = action

		if (type === 'Common.openModal') {
			openModal({ namespace, primary, data_item, payload })
		}

		if (type === 'Common.closeModal') {
			closeModal({ namespace })
		}

		if (type === 'Common.historyPush') {
			historyPush({ payload })
		}

		if (type === 'Common.historyBack') {
			historyBack()
		}

		if (type === 'Table.save') {
			TableSave({ namespace, data_item })
		}

		if (type === 'Table.delete') {
			tableDelete({ namespace, primary, data_item })
		}

		if (type === 'Form.save') {
			FormSave({ namespace, data_item })
		}

		if (type === 'Form.delete') {
			FormDelete({ namespace, primary, data_item, payload })
		}

		if (type.startsWith('Service.')) {
			Service({ action })
		}

		if (type.startsWith('Studio.')) {
			Studio({ action })
		}
	}
}

export default () => onAction
