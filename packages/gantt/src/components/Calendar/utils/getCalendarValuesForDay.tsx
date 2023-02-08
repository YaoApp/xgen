import { getDaysInMonth, getLocalDayOfWeek, getLocaleMonth } from '@/utils'

import { Top } from '../components'

import type { IPropsCalendar } from '../types'
import type { ReactElement } from 'react'

interface UtilProps extends Pick<IPropsCalendar, 'columnWidth' | 'dateSetup' | 'headerHeight' | 'locale'> {}

export default (props: UtilProps) => {
	const { columnWidth, dateSetup, headerHeight, locale } = props

	const topValues: ReactElement[] = []
	const bottomValues: ReactElement[] = []
	const topDefaultHeight = headerHeight * 0.5
      const dates = dateSetup.dates
      
	for (let i = 0; i < dates.length; i++) {
		const date = dates[i]
		const bottomValue = `${getLocalDayOfWeek(date, locale, 'short')}, ${date.getDate().toString()}`

		bottomValues.push(
			<text
				className='calendarBottomText'
				y={headerHeight * 0.8}
				x={columnWidth * i + columnWidth * 0.5}
				key={date.getTime()}
			>
				{bottomValue}
			</text>
		)

		if (i + 1 !== dates.length && date.getMonth() !== dates[i + 1].getMonth()) {
			const topValue = getLocaleMonth(date, locale)

			topValues.push(
				<Top
					key={topValue + date.getFullYear()}
					value={topValue}
					x1Line={columnWidth * (i + 1)}
					y1Line={0}
					y2Line={topDefaultHeight}
					xText={
						columnWidth * (i + 1) -
						getDaysInMonth(date.getMonth(), date.getFullYear()) * columnWidth * 0.5
					}
					yText={topDefaultHeight * 0.9}
				/>
			)
		}
      }
      
	return [topValues, bottomValues]
}
