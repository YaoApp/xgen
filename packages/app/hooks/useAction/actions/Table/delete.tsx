import { showTip } from '../../utils'

import type { OnAction } from '../../index'

export default async ({ namespace, primary, data_item, it }: OnAction) => {
	if (it.tip) {
		const ok = await showTip(it.tip)

		if (!ok) return
	}

	window.$app.Event.emit(`${namespace}/delete`, data_item[primary])
}
