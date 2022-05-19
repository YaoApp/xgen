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

	useAxisChart(ref, {
		name: props.__name,
		data: props.data,
		base: props.name_key,
		series: [
			{
				name: props.value_key,
				type: props.type || 'bar',
				itemStyle: {
					borderRadius: 3,
					color: props.color || '#3371fc',
					opacity: is_dark ? 0.5 : 0.1
				},
				emphasis: {
					itemStyle: { opacity: 1 }
				},
				splitLine: { show: false },
				axisLabel: { show: false }
			}
		],
		axisLabel: { show: false },
		option: {
			grid: {
				top: '2%',
				bottom: '2%',
				left: '-2%',
				right: '-2%',
				containLabel: true,
				show: false
			}
		}
	})

	return (
		<div className={clsx([styles._local, 'w_100 flex flex_column'])}>
			<div className='flex justify_between align_end'>
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
