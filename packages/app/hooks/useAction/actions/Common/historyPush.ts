import UrlPattern from 'url-pattern'

import { history } from '@umijs/max'
import { getDeepValue } from '@yaoapp/utils'

import type { Component, Action } from '@/types'

interface Args {
	data_item: Component.Props['__data_item']
	action: Action.HistoryPush
}

export default ({ data_item, action }: Args) => {
	const params = action.pathname.split('/').reduce((total: any, item: string) => {
		if (item && item.indexOf(':') !== -1) {
			const key = item.replace(':', '')

			total[key] = getDeepValue(key, data_item)
		}

		return total
	}, {})

	const pattern = new UrlPattern(action.pathname)
	const target = {
		pathname: pattern.stringify(params),
		search: new URLSearchParams(action.search).toString()
	}

	history.push(target)
}
