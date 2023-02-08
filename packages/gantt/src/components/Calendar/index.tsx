import { useValues } from './hooks'
import styles from './index.css'

import type { IPropsCalendar } from './types'

export const Calendar = (props: IPropsCalendar) => {
	const { dateSetup, locale, viewMode, rtl, headerHeight, columnWidth, fontFamily, fontSize } = props

	const [topValues, bottomValues] = useValues({
		dateSetup,
		locale,
		viewMode,
		rtl,
		headerHeight,
		columnWidth,
		fontFamily,
		fontSize
	})

	return (
		<g className='calendar' fontSize={fontSize} fontFamily={fontFamily}>
			<rect
				x={0}
				y={0}
				width={columnWidth * dateSetup.dates.length}
				height={headerHeight}
				className={styles.calendarHeader}
			/>
			{bottomValues} {topValues}
		</g>
	)
}
