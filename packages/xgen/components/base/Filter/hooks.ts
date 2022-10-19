import { useEffect, useMemo, useState } from 'react'

import type { Common } from '@/types'
import type { IPropsFilter } from './types'

export const useVisibleMore = () => {
	const [visible_more, setVisibleMore] = useState(false)
	const [display_more, setDisplayMore] = useState(false)
	const [opacity_more, setOpacityMore] = useState(false)

	useEffect(() => {
		if (visible_more) {
			setDisplayMore(true)

			setTimeout(() => {
				setOpacityMore(true)
			}, 0)
		} else {
			setOpacityMore(false)

			const timer = setTimeout(() => {
				setDisplayMore(false)
			}, 300)

			return () => clearTimeout(timer)
		}
	}, [visible_more])

	return { visible_more, display_more, opacity_more, setVisibleMore }
}

export const useCalcLayout = (columns: Array<Common.Column>, actions: IPropsFilter['actions']) => {
	return useMemo(() => {
		if (!columns.length) return { base: [], more: [], visible_btn_more: false }

		const actions_width = actions?.reduce((total, item) => {
			total += item.width || 3

			return total
		}, 0)

		const setting_cols = actions && actions_width ? actions_width : 0
		const base: Array<Common.Column> = []
		const more: Array<Common.Column> = []

		const filter_cols = columns.reduce((total: number, item: Common.Column) => {
			total += item.width || 0

			if (total > 20 - setting_cols) {
				more.push(item)
			} else {
				base.push(item)
			}

			return total
		}, 0)

		return { base, more, visible_btn_more: filter_cols > 20 - setting_cols }
	}, [columns])
}
