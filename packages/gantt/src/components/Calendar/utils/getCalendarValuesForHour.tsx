import { getCachedDateTimeFormat, getLocalDayOfWeek, getLocaleMonth } from '@/utils'

import { Top } from '../components'

import type { IPropsCalendar } from '../types'
import type { ReactElement } from 'react'

interface UtilProps
	extends Pick<IPropsCalendar, 'columnWidth' | 'dateSetup' | 'headerHeight' | 'rtl' | 'locale' | 'fontFamily'> {}

export default (props: UtilProps) => {
	const { columnWidth, dateSetup, headerHeight, rtl, locale, fontFamily } = props

	const topValues: ReactElement[] = []
	const bottomValues: ReactElement[] = []
	const topDefaultHeight = headerHeight * 0.5
      const dates = dateSetup.dates
      
	for (let i = 0; i < dates.length; i++) {
		const date = dates[i]
		const bottomValue = getCachedDateTimeFormat(locale, {
			hour: 'numeric'
		}).format(date)

		bottomValues.push(
			<text
				key={date.getTime()}
				y={headerHeight * 0.8}
				x={columnWidth * (i + +rtl)}
				className='calendarBottomText'
				fontFamily={fontFamily}
			>
				{bottomValue}
			</text>
            )
            
		if (i !== 0 && date.getDate() !== dates[i - 1].getDate()) {
			const displayDate = dates[i - 1]
			const topValue = `${getLocalDayOfWeek(
				displayDate,
				locale,
				'long'
			)}, ${displayDate.getDate()} ${getLocaleMonth(displayDate, locale)}`
                  const topPosition = (date.getHours() - 24) / 2
                  
			topValues.push(
				<Top
					key={topValue + displayDate.getFullYear()}
					value={topValue}
					x1Line={columnWidth * i}
					y1Line={0}
					y2Line={topDefaultHeight}
					xText={columnWidth * (i + topPosition)}
					yText={topDefaultHeight * 0.9}
				/>
			)
		}
	}

	return [topValues, bottomValues]
}
