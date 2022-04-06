import { useCallback } from 'react'

import type { Action } from '@/types'

export default () => {
	return useCallback((style: Action['props']['style']) => {
		if (!style) return ''

		return style
	}, [])
}
