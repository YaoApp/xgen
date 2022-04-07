import { getDeepValue } from '@yaoapp/utils'

import { showTip } from '../../utils'

import type { OnAction } from '../../index'

export default async ({ namespace, primary, it, data_item }: OnAction) => {
	if (it.tip) {
		const ok = await showTip(it.tip)

		if (!ok) return
	}

	const params = it.action['Table.save']!
	const target = Object.keys(params).reduce((total: any, key: string) => {
		if (params[key].indexOf(':') !== -1) {
			total[key] = getDeepValue(key, data_item)
		} else {
			total[key] = params[key]
		}

		return total
	}, {})

	const data = {
		...target,
		[primary]: data_item[primary]
	}

	window.$app.Event.emit(`${namespace}/save`, data)
}
