import { useMemoizedFn } from 'ahooks'

import type { Action } from '@/types'

export default () => {
	return useMemoizedFn((style: Action.Props['style']) => {
		if (!style) return ''

		return style
	})
}
