import { useMemoizedFn } from 'ahooks'

import type { Action } from '@/types'

export default () => {
	return useMemoizedFn((disabled: Action.Props['disabled']) => {
		if (!disabled) return ''

		if (Array.isArray(disabled.value)) {
			if (disabled.value.includes(disabled.bind)) return 'disabled'
		} else {
			if (disabled.value === disabled.bind) return 'disabled'
		}

		return ''
	})
}
