import day from 'dayjs'

import { getDeepValue } from '@yaoapp/utils'

import type { Column } from '@/types'

export default (bind: string, dataItem: unknown, item: Column) => {
	let text = getDeepValue(bind, dataItem)

	if (item.view?.props['format']) {
		text = day(text).format(item.view?.props['format'])
	}

	return Array.isArray(text) ? text.join(',') : text !== undefined && text !== null ? text : '-'
}
