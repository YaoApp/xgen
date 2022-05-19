import clsx from 'clsx'
import { BarChart, LineChart } from 'echarts/charts'
import { AriaComponent, GridComponent, TitleComponent, TooltipComponent } from 'echarts/components'
import * as echarts from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { observer } from 'mobx-react-lite'
import { useRef } from 'react'

import { useGlobal } from '@/context/app'
import { useAxisChart } from '@/hooks'

import BaseNumber from './components/BaseNumber'
import styles from './index.less'

import type { Component } from '@/types'

echarts.use([
	CanvasRenderer,
	BarChart,
	LineChart,
	TitleComponent,
	GridComponent,
	AriaComponent,
	TooltipComponent
])

export interface IProps extends Component.PropsChartComponent {
	data: Array<any>
	name_key: string
	value_key: string
	type: 'bar' | 'line'
	prefix?: string
	unit?: string
	decimals?: number
	chartHeight?: number
	color?: string
}

const Index = (props: IProps) => {
	const global = useGlobal()
	const ref = useRef<HTMLDivElement>(null)
	const current = props.data[props.data.length - 1]
	const is_dark = global.theme === 'dark'
	const is_line = props.type === 'line'

	useAxisChart(ref, {
		name: props.__name,
		data: props.data,
		base: props.name_key,
		series: [
			{
				name: props.value_key,
				type: props.type || 'bar',
				itemStyle: {
					borderRadius: 6,
					color: props.color || '#3371fc',
					opacity: is_dark ? 0.5 : 0.1
				},
				emphasis: {
					itemStyle: { opacity: 1 }
				},
				splitLine: { show: false },
				axisLabel: { show: false },
				areaStyle: {
					opacity: is_dark ? 0.15 : 0.1
				},
				symbol: 'none'
			}
		],
		axisLabel: { show: false },
		option: {
			tooltip: is_line ? { trigger: 'axis' } : {},
			grid: {
				top: is_line ? '3%' : 0,
				bottom: is_line ? '-2%' : 0,
				left: is_line ? '-10%' : '-2%',
				right: is_line ? '-10%' : '-2%',
				containLabel: true,
				show: false
			}
		}
	})

	return (
		<div className={clsx([styles._local, 'w_100 flex flex_column'])}>
			<div
				className={clsx([
					'base_number_wrap w_100 border_box flex justify_between align_end',
					is_line && 'is_line'
				])}
			>
				<BaseNumber {...props} number={current[props.value_key]}></BaseNumber>
			</div>
			<div
				className='chart_wrap w_100 flex justify_between align_center'
				ref={ref}
				style={{ height: props.chartHeight || 120 }}
			></div>
		</div>
	)
}

export default new window.$app.Handle(Index).by(observer).by(window.$app.memo).get()
