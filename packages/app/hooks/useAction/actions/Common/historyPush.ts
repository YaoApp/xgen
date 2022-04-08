import UrlPattern from 'url-pattern'

import { history } from '@umijs/max'
import { getDeepValue } from '@yaoapp/utils'

import type { Component } from '@/types'

interface Args {
	data_item: Component.Props['__data_item']
	pathname: string
}

export default ({ pathname, data_item }: Args) => {
	const params = pathname.split('/').reduce((total: any, item: string) => {
		if (item && item.indexOf(':') !== -1) {
			const key = item.replace(':', '')

			total[key] = getDeepValue(key, data_item)
		}

		return total
	}, {})

	const pattern = new UrlPattern(pathname)
	const target = pattern.stringify(params)

	history.push(target)
}
