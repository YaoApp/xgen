import { history } from '@umijs/max'

import type { Action } from '@/types'
import type { OnAction } from '../useAction'

type Args = Pick<OnAction, 'namespace'>

export default ({ namespace }: Args) => {
	return (payload: Action.ActionMap['Common.historyPush']) =>
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

				if (history.location.pathname.indexOf(payload.pathname) !== -1) {
					window.$app.Event.emit(`${namespace}/refetch`)
				} else {
					history.push({
						pathname: payload.pathname,
						search
					})
				}
			}
		})
}
