import { useBoolean, useDebounceEffect } from 'ahooks'
import { useEffect, useState } from 'react'

import { fuzzyQuery } from '@/knife'

import type { IPropsMenu } from '../../../../types'

export default (items: IPropsMenu['items']) => {
	const [visible_input, { toggle }] = useBoolean(false)
	const [current_items, setCurrentItems] = useState<IPropsMenu['items']>([])
	const [input, setInput] = useState('')

	useEffect(() => {
		if (!items) return

		setCurrentItems(items)
	}, [items, visible_input])

	useDebounceEffect(
		() => {
			if (!input) return setCurrentItems(items)

			setCurrentItems(fuzzyQuery(items, input, 'name'))
		},
		[input],
		{ wait: 300 }
	)

	return { visible_input, current_items, toggle, setInput }
}
