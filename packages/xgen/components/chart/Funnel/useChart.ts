import * as echarts from 'echarts/core'
import { useLayoutEffect } from 'react'

import { dark, light } from '@/components/chart/theme'
import { useGlobal } from '@/context/app'

import type { RefObject } from 'react'
import type { FunnelSeriesOption } from 'echarts/charts'
import type {
	AriaComponentOption,
	TooltipComponentOption,
	LegendComponentOption,
	TitleComponentOption
} from 'echarts/components'

type Option = echarts.ComposeOption<
	FunnelSeriesOption | AriaComponentOption | TooltipComponentOption | LegendComponentOption | TitleComponentOption
>

export interface IProps {
	name: string
	data: Array<any>
	nameKey?: string
	height?: number
	series: Array<any>
}

const base_config: FunnelSeriesOption = {
	type: 'funnel',
	gap: 0,
	bottom: 6,
	maxSize: '100%',
	label: { show: false },
	itemStyle: { borderWidth: 0 },
	emphasis: { label: { show: false } }
}

export default (ref: RefObject<HTMLDivElement>, props: IProps) => {
	const global = useGlobal()

	useLayoutEffect(() => {
		if (!ref.current) return
		if (!props.data) return

		const series: Array<FunnelSeriesOption> = []
		const is_dark = global.theme === 'dark'
		const theme = is_dark ? dark : light

		props.series.map((item) => {
			series.push({
				...base_config,
				...item,
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
			title: { show: false },
			legend: {
				orient: 'horizontal',
				left: 'center',
				top: 'top',
				itemWidth: 20,
				itemHeight: 12
			},
			series
		}

		chart.setOption(option)

		return () => {
			chart.dispose()
		}
	}, [ref.current, props, global.theme])
}
