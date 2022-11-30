import { history } from '@umijs/max'

import type { Action } from '@/types'

interface Args {
	action: Action.HistoryPush
}

export default ({ action }: Args) => {
	const search = action.search ? new URLSearchParams(action.search).toString() : undefined

	if (action.pathname.startsWith('http')) {
		return window.open(action.pathname + (search ? `?${search}` : ''))
	} else {
		if (action.public) {
			return window.open(window.location.origin + action.pathname + (search ? `?${search}` : ''))
		}

		history.push({
			pathname: action.pathname,
			search
		})
	}
}
