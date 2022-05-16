import * as echarts from 'echarts/core'
import { useLayoutEffect } from 'react'
import store from 'store2'

import dark_theme from '@/components/chart/theme/dark'
import light_theme from '@/components/chart/theme/light'

import wrapText from './utils/wrapText'

import type { RefObject } from 'react'
import type { BarSeriesOption } from 'echarts/charts'
import type {
	GridComponentOption,
	AriaComponentOption,
	TooltipComponentOption,
	TitleComponentOption
} from 'echarts/components'

type Option = echarts.ComposeOption<
	| BarSeriesOption
	| GridComponentOption
	| AriaComponentOption
	| TooltipComponentOption
	| TitleComponentOption
>

export interface IProps {
	name: string
	height: number
	data: Array<any>
	x_key: string
	axisLabel: any
	vertical: boolean
	textWrap: boolean
	textLength: number
	series: Array<any>
	hide_label: boolean
}

export default (ref: RefObject<HTMLDivElement>, props: IProps) => {
	useLayoutEffect(() => {
		if (!ref.current) return
		if (!props.data) return

		const x_data: Array<string> = []
		const y_data: Array<any> = []
		const series: Array<BarSeriesOption> = []
		const is_dark = store.get('xgen-theme') === 'dark'

		props.data.map((item) => {
			x_data.push(item[props.x_key])
		})

		props.series.map((item, index) => {
			series.push({
				...item,
				yAxisIndex: index,
				data: props.data.reduce((total, it) => {
					total.push(it[item.name])

					return total
				}, [])
			})

			y_data.push({
				...item,
				name: '',
				type: 'value'
			})
		})

		const chart = echarts.init(ref.current, is_dark ? dark_theme : light_theme)

		const option: Option = {
			title: props.hide_label
				? {
						left: 'left',
						text: props.name,
						textStyle: {
							color: '#aaaab3',
							fontSize: 14,
							fontWeight: 500
						}
				  }
				: undefined,
			aria: {
				decal: { show: true }
                  },
			tooltip: {},
			grid: {
				top: props.hide_label ? '16%' : '8%',
				bottom: '4%',
				left: '2%',
				right: '2%',
				containLabel: true,
				show: false
			},
			[!props.vertical ? 'xAxis' : 'yAxis']: {
				type: 'category',
				data: x_data,
				axisTick: { show: false },
				axisLine: { show: false },
				axisLabel: {
					...(props.axisLabel || {}),
					formatter: (v: string) =>
						wrapText(v, props.textWrap, props.textLength)
				}
			},
			[props.vertical ? 'xAxis' : 'yAxis']: y_data,
			series
		}

		chart.setOption(option)
	}, [ref.current, props])
}
