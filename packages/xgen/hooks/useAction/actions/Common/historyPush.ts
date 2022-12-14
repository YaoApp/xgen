import { history } from '@umijs/max'

import type { Action } from '@/types'

interface Args {
	payload: Action.ActionMap['Common.historyPush']
}

export default ({ payload }: Args) => {
	const search = payload.search ? new URLSearchParams(payload.search).toString() : undefined

	if (payload.pathname.startsWith('http')) {
		return window.open(payload.pathname + (search ? `?${search}` : ''))
	} else {
		if (payload.public) {
			return window.open(window.location.origin + payload.pathname + (search ? `?${search}` : ''))
		}

		history.push({
			pathname: payload.pathname,
			search
		})
	}
}
