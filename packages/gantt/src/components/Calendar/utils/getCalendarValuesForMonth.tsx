import { getLocaleMonth } from '@/utils'

import { Top } from '../components'

import type { IPropsCalendar } from '../types'
import type { ReactElement } from 'react'

interface UtilProps extends Pick<IPropsCalendar, 'columnWidth' | 'dateSetup' | 'headerHeight' | 'rtl' | 'locale'> {}

export default (props: UtilProps) => {
	const { columnWidth, dateSetup, headerHeight, rtl, locale } = props

	const topValues: ReactElement[] = []
	const bottomValues: ReactElement[] = []
	const topDefaultHeight = headerHeight * 0.5

	for (let i = 0; i < dateSetup.dates.length; i++) {
		const date = dateSetup.dates[i]
		const bottomValue = getLocaleMonth(date, locale)

		bottomValues.push(
			<text
				className='calendarBottomText'
				y={headerHeight * 0.8}
				x={columnWidth * i + columnWidth * 0.5}
				key={bottomValue + date.getFullYear()}
			>
				{bottomValue}
			</text>
		)

		if (i === 0 || date.getFullYear() !== dateSetup.dates[i - 1].getFullYear()) {
			const topValue = date.getFullYear().toString()
			let xText: number

			if (rtl) {
				xText = (6 + i + date.getMonth() + 1) * columnWidth
			} else {
				xText = (6 + i - date.getMonth()) * columnWidth
			}

			topValues.push(
				<Top
					key={topValue}
					value={topValue}
					x1Line={columnWidth * i}
					y1Line={0}
					y2Line={topDefaultHeight}
					xText={xText}
					yText={topDefaultHeight * 0.9}
				/>
			)
		}
	}

	return [topValues, bottomValues]
}
