import type { OnAction } from '../../index'

type Args = Omit<OnAction, 'it'>

export default async ({ namespace, primary, data_item }: Args) => {
	window.$app.Event.emit(`${namespace}/delete`, data_item[primary])
}
