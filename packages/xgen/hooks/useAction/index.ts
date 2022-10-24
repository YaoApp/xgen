import { historyBack, historyPush, openModal } from './actions/Common'
import { delete as FormDelete, save as FormSave } from './actions/Form'
import { delete as tableDelete, save as TableSave } from './actions/Table'
import { Service, Studio } from './actions/Yao'

import type { Component, Action } from '@/types'

export interface OnAction {
	namespace: Component.Props['__namespace']
	primary: Component.Props['__primary']
	data_item: Component.Props['__data_item']
	it: Action.Props
}

const onAction = ({ namespace, primary, data_item, it }: OnAction) => {
	if (it.action?.['Common.openModal']) {
		openModal({ namespace, primary, data_item, it })
	}

	if (it.action?.['Common.historyPush']) {
		historyPush({ data_item, action: it.action['Common.historyPush'] })
	}

	if (it.action?.['Common.historyBack']) {
		historyBack()
	}

	if (it.action?.['Table.save']) {
		TableSave({ namespace, primary, data_item, it })
	}

	if (it.action?.['Table.delete']) {
		tableDelete({ namespace, primary, data_item, it })
      }
      
      if (it.action?.['Form.save']) {
		FormSave({ namespace, primary, data_item, it })
	}

	if (it.action?.['Form.delete']) {
		FormDelete({ namespace, primary, data_item, it })
	}

	if (Object.keys(it.action)[0].startsWith('Service.')) {
		Service({ it })
	}

	if (Object.keys(it.action)[0].startsWith('Studio.')) {
		Studio({ it })
	}
}

export default () => onAction
