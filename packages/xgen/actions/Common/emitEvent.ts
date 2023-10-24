import type { Action } from '@/types'

export default () => {
	return async (payload: Action.EmitEvent) => {
		const { key, value } = payload

		await window.$app.Event.emit(key, value)
	}
}
