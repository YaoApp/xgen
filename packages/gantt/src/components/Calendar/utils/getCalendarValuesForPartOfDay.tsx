import { ViewMode } from '@/types'
import { getCachedDateTimeFormat, getLocalDayOfWeek, getLocaleMonth } from '@/utils'

import { Top } from '../components'

import type { IPropsCalendar } from '../types'
import type { ReactElement } from 'react'

interface UtilProps
	extends Pick<
		IPropsCalendar,
		'columnWidth' | 'dateSetup' | 'headerHeight' | 'rtl' | 'locale' | 'fontFamily' | 'viewMode'
	> {}

export default (props: UtilProps) => {
	const { columnWidth, dateSetup, headerHeight, rtl, locale, fontFamily, viewMode } = props

	const topValues: ReactElement[] = []
	const bottomValues: ReactElement[] = []
	const ticks = viewMode === ViewMode.HalfDay ? 2 : 4
	const topDefaultHeight = headerHeight * 0.5
	const dates = dateSetup.dates

	for (let i = 0; i < dates.length; i++) {
		const date = dates[i]
		const bottomValue = getCachedDateTimeFormat(locale, {
			hour: 'numeric'
		}).format(date)

		bottomValues.push(
			<text
				className='calendarBottomText'
				key={date.getTime()}
				y={headerHeight * 0.8}
				x={columnWidth * (i + +rtl)}
				fontFamily={fontFamily}
			>
				{bottomValue}
			</text>
		)

		if (i === 0 || date.getDate() !== dates[i - 1].getDate()) {
			const topValue = `${getLocalDayOfWeek(date, locale, 'short')}, ${date.getDate()} ${getLocaleMonth(
				date,
				locale
			)}`

			topValues.push(
				<Top
					key={topValue + date.getFullYear()}
					value={topValue}
					x1Line={columnWidth * i + ticks * columnWidth}
					y1Line={0}
					y2Line={topDefaultHeight}
					xText={columnWidth * i + ticks * columnWidth * 0.5}
					yText={topDefaultHeight * 0.9}
				/>
			)
		}
	}

	return [topValues, bottomValues]
}
