import { getDeepValue } from '@/knife'

import { showConfirm } from '../../utils'

import type { OnAction } from '../../index'

export default async ({ namespace, primary, it, data_item }: OnAction) => {
	if (it.confirm) {
		const ok = await showConfirm(it.confirm)

		if (!ok) return
	}

	const params = it.action['Table.save']!
	const target = getDeepValue(params, data_item)

	const data = {
		...target,
		[primary]: data_item[primary]
	}

	window.$app.Event.emit(`${namespace}/save`, data)
}
