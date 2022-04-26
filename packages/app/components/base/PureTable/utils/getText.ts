import { getDeepValue } from '@yaoapp/utils'

import type { Common } from '@/types'

export default (field_detail: Common.Column, dataItem: unknown) => {
	let text = getDeepValue(field_detail.bind, dataItem)

	return Array.isArray(text) ? text.join(',') : text !== undefined && text !== null ? text : '-'
}
