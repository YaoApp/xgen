import { useMemo } from 'react'

import { getComputedStyleNumber } from '@/utils'

import type { Common } from '@/types'

type CalcLayoutOptions = {
	mounted: boolean
	form_name: string
}

export default (columns: Array<Common.Column>, { mounted, form_name }: CalcLayoutOptions) => {
	return useMemo(() => {
		const initial = { base: [], more: [], visible_btn_more: false }

		if (!mounted) return initial
		if (!columns.length) return initial

		const form = document.getElementById(form_name)!

		if (!form) return initial

		const width_max = getComputedStyleNumber(getComputedStyle(form).getPropertyValue('width'))
		const width_gutter = 16
		const width_btn_more = 38
		const width_filter_actions = 72 * 2
		const width_custom_actions = Array.from(document.querySelectorAll(`#${form_name} .btn_action`)).reduce(
			(total, item) => {
				total += getComputedStyleNumber(getComputedStyle(item).getPropertyValue('width')) + width_gutter

				return total
			},
			0
		)

		const base: Array<Common.Column> = []
		const more: Array<Common.Column> = []

		columns.reduce((total: number, item: Common.Column) => {
			const width_item = ((item.width || 0) / 24) * width_max

			total += width_item

			if (total + width_btn_more + width_filter_actions + width_custom_actions > width_max) {
				more.push(item)
			} else {
				base.push(item)
			}

			return total
		}, 0)

		return { base, more, visible_btn_more: more.length > 0 }
	}, [columns, mounted, form_name])
}
