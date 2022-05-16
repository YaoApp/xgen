import { LineChart } from 'echarts/charts'
import { AriaComponent, GridComponent, TitleComponent, TooltipComponent } from 'echarts/components'
import * as echarts from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { useRef } from 'react'

import useChart from '@/hooks/chart/useAxisChart'

import type { IProps } from '@/hooks/chart/useAxisChart'

echarts.use([
	CanvasRenderer,
	LineChart,
	TitleComponent,
	GridComponent,
	AriaComponent,
	TooltipComponent
])

const Index = (props: IProps) => {
	const ref = useRef<HTMLDivElement>(null)

	useChart(ref, props)

	return <div className='w_100' ref={ref} style={{ height: props.height || 300 }}></div>
}

export default window.$app.memo(Index)
