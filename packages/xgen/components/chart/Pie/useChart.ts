import * as echarts from 'echarts/core'
import { useLayoutEffect } from 'react'

import { dark, light } from '@/components/chart/theme'
import { useGlobal } from '@/context/app'

import type { RefObject } from 'react'
import type { PieSeriesOption } from 'echarts/charts'
import type {
	AriaComponentOption,
	TooltipComponentOption,
	LegendComponentOption,
	TitleComponentOption
} from 'echarts/components'

type Option = echarts.ComposeOption<
	PieSeriesOption | AriaComponentOption | TooltipComponentOption | LegendComponentOption | TitleComponentOption
>

export interface IProps {
	name: string
	data: Array<any>
	series: Array<any>
	nameKey?: string
	height?: number
}

export default (ref: RefObject<HTMLDivElement>, props: IProps) => {
	const global = useGlobal()

	useLayoutEffect(() => {
		if (!ref.current) return
		if (!props.data) return

		const series: Array<PieSeriesOption> = []
		const is_dark = global.theme === 'dark'
		const theme = is_dark ? dark : light

		props.series.map((item) => {
			series.push({
				...item,
				type: 'pie',
				data: props.data.reduce((total, it) => {
					total.push({
						name: it[props.nameKey || 'name'],
						value: it[item.valueKey || 'value']
					})

					return total
				}, [])
			})
		})

		const chart = echarts.init(ref.current, theme)

		const option: Option = {
			aria: {},
			tooltip: {},
			legend: {},
			series
		}

		chart.setOption(option)

		return () => {
			chart.dispose()
		}
	}, [ref.current, props, global.theme])
}
