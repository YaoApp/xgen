import { historyBack, historyPush } from './useAction/actions/Common'

import type { Action } from '@/types'

export interface OnAction {
	it: Action.Props
}

const onAction = ({ it }: OnAction) => {
	if (it.action?.['Common.historyPush']) {
		historyPush({ action: it.action['Common.historyPush'] })
	}

	if (it.action?.['Common.historyBack']) {
		historyBack()
	}
}

export default () => onAction
