import { useFn } from '@/hooks'
import { getDeepValue } from '@/knife'

import type { Action } from '@/types'

export default (data_item: any) => {
	return useFn((disabled: Action.Props['disabled']) => {
		if (!disabled) return ''

		const real_value = getDeepValue(disabled.bind, data_item)

		if (Array.isArray(disabled)) {
			if (disabled.value.includes(real_value)) return 'disabled'
		} else {
			if (disabled.value === real_value) return 'disabled'
		}

		return ''
	})
}
