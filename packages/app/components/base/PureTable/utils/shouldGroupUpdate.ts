import { deepEqual, getDeepValue } from '@yaoapp/utils'

import type { Common } from '@/types'

export default (new_val: any, old_val: any, raw_col_item: Common.Column) => {
	let update = false
	const deps: Array<string> = raw_col_item.bind as any

	deps.map((key: string) => {
		const _new = getDeepValue(key, new_val)
		const _old = getDeepValue(key, old_val)

		if (!deepEqual(_new, _old)) update = true
	})

	return update
}
