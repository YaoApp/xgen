import day from 'dayjs'

import { getDeepValue } from '@yaoapp/utils'

import type { Common } from '@/types'

export default (field_detail: Common.Column, dataItem: unknown) => {
	let text = getDeepValue(field_detail.bind, dataItem)

	if (field_detail.view?.props['format']) {
		text = day(text).format(field_detail.view?.props['format'])
	}

	return Array.isArray(text) ? text.join(',') : text !== undefined && text !== null ? text : '-'
}
