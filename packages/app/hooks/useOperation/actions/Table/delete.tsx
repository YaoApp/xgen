import { showTip } from '../../utils'

import type { HandleOperation } from '../../index'

export default async ({ namespace, primary, data_item, it }: HandleOperation) => {
	if (it.tip) {
		const ok = await showTip(it.tip)

		if (!ok) return
	}

	window.$app.Event.emit(`${namespace}/delete`, data_item[primary])
}
