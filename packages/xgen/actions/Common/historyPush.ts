import { history } from '@umijs/max'

import type { Action } from '@/types'
import type { OnAction } from '../useAction'

type Args = Pick<OnAction, 'namespace' | 'extra'>

export default ({ namespace, extra }: Args) => {
	return (payload: Action.ActionMap['Common.historyPush']) =>
		new Promise<void>((resolve) => {
			const search = payload.search ? new URLSearchParams(payload.search).toString() : undefined
			const query =
				payload?.withFilterQuery && extra?.query
					? new URLSearchParams(extra.query).toString()
					: undefined
			const params = search || query ? `?${search ?? ''}${query ?? ''}` : ''

                  if (payload.pathname.startsWith('http')) {
                        resolve()
                        
				return window.open(payload.pathname + params)
			} else {
                        if (payload.public) {
                              resolve()

					return window.open(window.location.origin + payload.pathname + params)
				}

				window.addEventListener('popstate', () => resolve(), { once: true })

                        if (history.location.pathname.indexOf(payload.pathname) !== -1) {
                              resolve()

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
