import type { Action } from '@/types'

export default () => {
	return (payload: Action.Reload) =>
		new Promise<void>((resolve) => {
			window.location.reload()

			if (payload.neo) setTimeout(() => window.$app.Event.emit('app/setNeoVisible'), 900)

			resolve()
		})
}
