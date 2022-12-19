import { history } from '@umijs/max'

import type { Action } from '@/types'

type Args = { payload: Action.ActionMap['Common.historyPush'] }

export default ({ payload }: Args) => {
	return () =>
		new Promise<void>((resolve) => {
			const search = payload.search ? new URLSearchParams(payload.search).toString() : undefined

			if (payload.pathname.startsWith('http')) {
				return window.open(payload.pathname + (search ? `?${search}` : ''))
			} else {
				if (payload.public) {
					return window.open(
						window.location.origin + payload.pathname + (search ? `?${search}` : '')
					)
				}

				window.addEventListener('popstate', () => resolve(), { once: true })

				history.push({
					pathname: payload.pathname,
					search
				})
			}
		})
}
