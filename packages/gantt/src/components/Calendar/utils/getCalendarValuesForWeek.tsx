import { getLocaleMonth, getWeekNumberISO8601 } from '@/utils'

import { Top } from '../components'

import type { IPropsCalendar } from '../types'
import type { ReactElement } from 'react'

interface UtilProps extends Pick<IPropsCalendar, 'columnWidth' | 'dateSetup' | 'headerHeight' | 'rtl' | 'locale'> {}

export default (props: UtilProps) => {
	const { columnWidth, dateSetup, headerHeight, rtl, locale } = props

	const topValues: ReactElement[] = []
	const bottomValues: ReactElement[] = []
	const topDefaultHeight = headerHeight * 0.5
	const dates = dateSetup.dates
	let weeksCount: number = 1

	for (let i = dates.length - 1; i >= 0; i--) {
		const date = dates[i]
		let topValue = ''

		if (i === 0 || date.getMonth() !== dates[i - 1].getMonth()) {
			topValue = `${getLocaleMonth(date, locale)}, ${date.getFullYear()}`
		}
		const bottomValue = `W${getWeekNumberISO8601(date)}`

		bottomValues.push(
			<text
				className='calendarBottomText'
				y={headerHeight * 0.8}
				x={columnWidth * (i + +rtl)}
				key={date.getTime()}
			>
				{bottomValue}
			</text>
		)

		if (topValue) {
			if (i !== dates.length - 1) {
				topValues.push(
					<Top
						key={topValue}
						value={topValue}
						x1Line={columnWidth * i + weeksCount * columnWidth}
						y1Line={0}
						y2Line={topDefaultHeight}
						xText={columnWidth * i + columnWidth * weeksCount * 0.5}
						yText={topDefaultHeight * 0.9}
					/>
				)
			}

			weeksCount = 0
		}

		weeksCount++
	}

	return [topValues, bottomValues]
}
