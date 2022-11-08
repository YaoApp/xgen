import { BarChart } from 'echarts/charts'
import { AriaComponent, GridComponent, TitleComponent, TooltipComponent } from 'echarts/components'
import * as echarts from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { observer } from 'mobx-react-lite'
import { useRef } from 'react'

import { useAxisChart } from '@/hooks'

import type { IProps } from '@/hooks/chart/useAxisChart'

echarts.use([CanvasRenderer, BarChart, TitleComponent, GridComponent, AriaComponent, TooltipComponent])

const Index = (props: IProps) => {
	const ref = useRef<HTMLDivElement>(null)

	useAxisChart(ref, props)

	return <div className='w_100' ref={ref} style={{ height: props.height || 300 }}></div>
}

export default new window.$app.Handle(Index).by(observer).by(window.$app.memo).get()
