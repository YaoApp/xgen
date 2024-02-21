import clsx from 'clsx'
import { BarChart, LineChart } from 'echarts/charts'
import { AriaComponent, GridComponent, TitleComponent, TooltipComponent } from 'echarts/components'
import * as echarts from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { useRef } from 'react'

import { useGlobal } from '@/context/app'
import { useAxisChart } from '@/hooks'

import BaseNumber from './components/BaseNumber'
import styles from './index.less'

import type { Component } from '@/types'

echarts.use([CanvasRenderer, BarChart, LineChart, TitleComponent, GridComponent, AriaComponent, TooltipComponent])

export interface IProps extends Component.PropsChartComponent {
	data: Array<any>
	type: 'bar' | 'line'
	nameKey?: string
	valueKey?: string
	prefix?: string
	unit?: string
	decimals?: number
	height?: number
	color?: string
}

const Index = (props: IProps) => {
	const global = useGlobal()
	const ref = useRef<HTMLDivElement>(null)

	const current = props.data[props.data.length - 1] || { value : 0}
	const is_dark = global.theme === 'dark'
	const is_line = props.type === 'line'

	useAxisChart(ref, {
		name: props.__name,
		data: props.data,
		nameKey: props.nameKey,
		series: [
			{
				name: props.valueKey,
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
		<div className={clsx([styles._local, 'w_100 flex flex_column'])} style={{ height: props.height || 300 }}>
			<div
				className={clsx([
					'base_number_wrap w_100 border_box flex justify_between align_end',
					is_line && 'is_line'
				])}
			>
				<BaseNumber {...props} number={current[props.valueKey || 'value']}></BaseNumber>
			</div>
			<div
				className='chart_wrap w_100 flex justify_between align_center'
				ref={ref}
				style={{ height: `calc(100% - 24px)` }}
			></div>
		</div>
	)
}

export default window.$app.memo(Index)
