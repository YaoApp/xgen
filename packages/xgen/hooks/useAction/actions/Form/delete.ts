import type { OnAction } from '../../index'
import type { Action } from '@/types'

type Args = Omit<OnAction, 'it'> & { payload: Action.ActionMap['Form.delete'] }

export default async ({ namespace, primary, data_item, payload }: Args) => {
	window.$app.Event.emit(`${namespace}/delete`, data_item[primary], payload)
}
