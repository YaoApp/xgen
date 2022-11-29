import * as echarts from 'echarts/core'
import { useLayoutEffect } from 'react'

import { dark, light } from '@/components/chart/theme'
import { useGlobal } from '@/context/app'

import wrapText from './utils/wrapText'

import type { RefObject } from 'react'
import type { BarSeriesOption, LineSeriesOption } from 'echarts/charts'
import type {
	GridComponentOption,
	AriaComponentOption,
	TooltipComponentOption,
	TitleComponentOption
} from 'echarts/components'

type Option = echarts.ComposeOption<
	| LineSeriesOption
	| BarSeriesOption
	| GridComponentOption
	| AriaComponentOption
	| TooltipComponentOption
	| TitleComponentOption
>

export interface IProps {
	name: string
	data: Array<any>
	series: Array<any>
	nameKey?: string
	vertical?: boolean
	textWrap?: boolean
	textLength?: number
	height?: number
	axisLabel?: any
	option?: Option
}

export default (ref: RefObject<HTMLDivElement>, props: IProps) => {
	const global = useGlobal()

	useLayoutEffect(() => {
		if (!ref.current) return
		if (!props.data) return

		const x_data: Array<string> = []
		const y_data: Array<any> = []
		const series: Array<BarSeriesOption> = []
		const is_dark = global.theme === 'dark'
		const theme = is_dark ? dark : light

		props.data.map((item) => {
			x_data.push(item[props.nameKey || 'name'])
		})

		props.series.map((item, index) => {
			series.push({
				...item,
				yAxisIndex: index,
				data: props.data.reduce((total, it) => {
					total.push(it[item.valueKey || 'value'])

					return total
				}, [])
			})

			y_data.push({
				...item,
				name: '',
				type: 'value'
			})
		})

		const chart = echarts.init(ref.current, theme)

		const option: Option = {
			aria: {},
			tooltip: {},
			...props.option,
			[!props.vertical ? 'xAxis' : 'yAxis']: {
				type: 'category',
				data: x_data,
				axisTick: { show: false },
				axisLine: { show: false },
				axisLabel: {
					...(props.axisLabel || {}),
					formatter: (v: string) => wrapText(v, props.textWrap || false, props.textLength || 8)
				}
			},
			[props.vertical ? 'xAxis' : 'yAxis']: y_data,
			series
		}

		chart.setOption(option)

		const observer = new MutationObserver(() => setTimeout(() => chart.resize(), 300))

		observer.observe(document.getElementById('page_content_wrap')!, {
			attributes: true
		})

		setTimeout(() => {
			chart.resize({ animation: { duration: 300 } })
		}, 300)

		return () => {
			chart.dispose()
			observer.disconnect()
		}
	}, [ref.current, props, global.theme])
}
