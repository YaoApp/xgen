import { useRows, useTicksToday } from './hooks'
import styles from './index.css'

import type { IPropsGrid } from './types'

const Index = (props: IPropsGrid) => {
	const { tasks, dates, rowHeight, svgWidth, columnWidth, todayColor, rtl } = props
	const { gridRows, rowLines, y } = useRows({ tasks, rowHeight, svgWidth })
	const {ticks,today} = useTicksToday({ dates, columnWidth, todayColor, rtl, y })

	return (
		<g className={styles._local}>
			<g className='gridBody'>
				<g className='rows'>{gridRows}</g>
				<g className='rowLines'>{rowLines}</g>
				<g className='ticks'>{ticks}</g>
				<g className='today'>{today}</g>
			</g>
		</g>
	)
}

export default Index
