import { useFn } from '@/hooks'

import type { Action } from '@/types'

export default () => {
	return useFn((style: Action.Props['style']) => {
		if (!style) return ''

		return style
	})
}
