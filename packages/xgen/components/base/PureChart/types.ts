import type Model from '@/components/base/Chart/model'
import type { Chart } from '@/types'

export interface IPropsPureChart {
	data: Model['data']
	columns: Model['chart_columns']
}

export interface IPropsChartItem {
	item: Chart.Column
	data: Model['data']
}

export interface IPropsChartLink {
	link_tooltip: string
	link: string
}

export interface LocalePureChart {
	link_tooltip: string
}

export interface Locale {
	[key: string]: LocalePureChart
}
