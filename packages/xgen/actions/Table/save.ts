import type { OnAction } from '../useAction'
import type { Action } from '@/types'

type Args = Pick<OnAction, 'namespace' | 'data_item' | 'primary'> & { payload: Action.ActionMap['Table.save'] }

export default ({ namespace, data_item, primary, payload }: Args) => {
	return () => window.$app.Event.emit(`${namespace}/save`, { ...payload, [primary]: data_item[primary] })
}
