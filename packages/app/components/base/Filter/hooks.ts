import { useEffect, useMemo, useState } from 'react'

import type { Column } from '@/types'

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

export const useCalcLayout = (columns: Array<Column>) => {
	return useMemo(() => {
		if (!columns.length) return { base: [], more: [], visible_btn_more: false }

		const setting_cols = 3
		const base: Array<Column> = []
		const more: Array<Column> = []

		const filter_cols = columns.reduce((total: number, item: Column) => {
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
