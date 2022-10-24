import { showConfirm } from '../../utils'

import type { OnAction } from '../../index'

export default async ({ namespace, primary, data_item, it }: OnAction) => {
	if (it.confirm) {
		const ok = await showConfirm(it.confirm)

		if (!ok) return
	}

	const params = it.action['Form.delete']!

	window.$app.Event.emit(`${namespace}/delete`, data_item[primary], params)
}
