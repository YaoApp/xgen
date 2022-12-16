import { getPath, retryUntil } from '@/utils'

import type { history } from '@umijs/max'

export const onRouteChange = ({ location: { pathname, search } }: typeof history) => {
	retryUntil(
		() => window.$app.Event.emit('app/updateMenuStatus', getPath(pathname) + decodeURIComponent(search)),
		() => window.$global !== undefined
	)
}
