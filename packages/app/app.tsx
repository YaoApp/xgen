import { retryUntil } from '@/utils'

export const onRouteChange = () => {
	retryUntil(
		() => window.$app.Event.emit('app/updateMenuStatus'),
		() => window.$global !== undefined
	)
}
