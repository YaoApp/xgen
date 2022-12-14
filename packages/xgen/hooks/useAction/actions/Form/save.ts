import type { OnAction } from '../../index'

type Args = Omit<OnAction, 'primary' | 'it'>

export default async ({ namespace, data_item }: Args) => {
	window.$app.Event.emit(`${namespace}/save`, data_item)
}
