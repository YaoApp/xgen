import { historyBack, historyPush, openModal } from './actions/Common'
import { delete as tableDelete, save } from './actions/Table'

import type { IPropsComponent, Action } from '@/types'

export interface OnAction {
	namespace: IPropsComponent['__namespace']
	primary: IPropsComponent['__primary']
	data_item: IPropsComponent['__data_item']
	it: Action
}

const onAction = ({ namespace, primary, data_item, it }: OnAction) => {
	if (it.action?.['Common.openModal']) {
		openModal({ namespace, primary, it })
	}

	if (it.action?.['Common.historyPush']) {
		historyPush({ data_item, pathname: it.action['Common.historyPush'].pathname })
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
