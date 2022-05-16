import * as echarts from 'echarts/core'

import type {
	GridComponentOption,
	AriaComponentOption,
	TooltipComponentOption,
	TitleComponentOption
} from 'echarts/components'
import type { BarSeriesOption } from 'echarts/charts'

type Option = echarts.ComposeOption<
	| BarSeriesOption
	| GridComponentOption
	| AriaComponentOption
	| TooltipComponentOption
	| TitleComponentOption
      >

export const tooltip: Option['tooltip'] = {
	textStyle: {
		color: '#a2a5b9',
		fontSize: 12
	},
	backgroundColor: '#232326',
	borderRadius: 6
}
