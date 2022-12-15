import type { OnAction } from '../useAction'

type Args = Omit<OnAction, 'it'>

export default ({ namespace, primary, data_item }: Args) => {
	return () => window.$app.Event.emit(`${namespace}/delete`, data_item[primary])
}
