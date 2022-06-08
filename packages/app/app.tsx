import { retryUntil } from '@/utils'

import type { history } from '@umijs/max'

export const onRouteChange = ({ location: { pathname } }: typeof history) => {
	retryUntil(
		() => window.$app.Event.emit('app/updateMenuStatus', pathname),
		() => window.$global !== undefined
	)
}
