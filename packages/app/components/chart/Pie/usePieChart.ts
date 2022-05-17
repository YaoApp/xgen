import * as echarts from 'echarts/core'
import { useLayoutEffect } from 'react'
import store from 'store2'

import { dark, light } from '@/components/chart/theme'

import type { RefObject } from 'react'
import type { BarSeriesOption } from 'echarts/charts'
import type {
	AriaComponentOption,
	TooltipComponentOption,
	LegendComponentOption,
	TitleComponentOption
} from 'echarts/components'

type Option = echarts.ComposeOption<
	| BarSeriesOption
	| AriaComponentOption
	| TooltipComponentOption
	| LegendComponentOption
	| TitleComponentOption
>

export interface IProps {
	name: string
	height: number
	data: Array<any>
	base: string
	tooltip: TooltipComponentOption
	legend: LegendComponentOption
	series: Array<any>
}

export default (ref: RefObject<HTMLDivElement>, props: IProps) => {
	useLayoutEffect(() => {
		if (!ref.current) return
		if (!props.data) return

		const series: Array<BarSeriesOption> = []
		const is_dark = store.get('xgen-theme') === 'dark'

		props.series.map((item) => {
			series.push({
				...item,
				data: props.data.reduce((total, it) => {
					total.push({ value: it[item.name], name: it[props.base] })

					return total
				}, [])
			})
		})

		const chart = echarts.init(ref.current, is_dark ? dark : light)

		const option: Option = {
			aria: {},
			tooltip: {},
			legend: { ...props.legend },
			series
		}

		chart.setOption(option)
	}, [ref.current, props])
}
