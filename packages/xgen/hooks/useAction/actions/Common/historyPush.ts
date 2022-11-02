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
		history.push({
			pathname: action.pathname,
			search
		})
	}
}
