import { useMemo } from 'react'

import type { Locale } from '../types'
import type Model from '../model'

export default (locale_messages: Locale[keyof Locale], id: Model['id'], type: Model['type']) => {
	return useMemo(() => {
		if (Number(id) === 0) return locale_messages.page.title.add

		return locale_messages.page.title[type]
	}, [locale_messages, id, type])
}
