import type { OnAction } from '../useAction'

type Args = Omit<OnAction, 'primary' | 'it'>

export default ({ namespace, data_item }: Args) => {
	return () => window.$app.Event.emit(`${namespace}/save`, data_item)
}
