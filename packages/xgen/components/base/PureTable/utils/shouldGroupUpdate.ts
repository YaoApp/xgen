import { deepEqual, getDeepValue } from '@/knife'

import type { Common } from '@/types'

export default (new_val: any, old_val: any, raw_col_item: Common.Column) => {
	let update = false
	const components = raw_col_item.view.props.components

	const deps: Array<string> = Object.keys(components).reduce((total: Array<string>, key) => {
		total.push(components[key]?.bind || components[key]?.view?.bind)

		return total
	}, [])

	deps.map((key: string) => {
		const _new = getDeepValue(key, new_val)
		const _old = getDeepValue(key, old_val)

		if (!deepEqual(_new, _old)) update = true
	})

	return update
}
