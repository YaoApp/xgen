import { retryUntil } from '@/utils'

import type { history } from '@umijs/max'

export const onRouteChange = ({ location: { pathname } }: typeof history) => {
      const path = pathname.replace($runtime.BASE, '/')
      
	retryUntil(
		() => window.$app.Event.emit('app/updateMenuStatus', path),
		() => window.$global !== undefined
	)
}
