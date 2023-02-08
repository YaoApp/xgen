import { ViewMode } from '@/types'

import { addToDate } from './addToDate'

export const seedDates = (startDate: Date, endDate: Date, viewMode: ViewMode) => {
	let currentDate: Date = new Date(startDate)
	const dates: Date[] = [currentDate]

	while (currentDate < endDate) {
		switch (viewMode) {
			case ViewMode.Year:
				currentDate = addToDate(currentDate, 1, 'year')
				break
			case ViewMode.QuarterYear:
				currentDate = addToDate(currentDate, 3, 'month')
				break
			case ViewMode.Month:
				currentDate = addToDate(currentDate, 1, 'month')
				break
			case ViewMode.Week:
				currentDate = addToDate(currentDate, 7, 'day')
				break
			case ViewMode.Day:
				currentDate = addToDate(currentDate, 1, 'day')
				break
			case ViewMode.HalfDay:
				currentDate = addToDate(currentDate, 12, 'hour')
				break
			case ViewMode.QuarterDay:
				currentDate = addToDate(currentDate, 6, 'hour')
				break
			case ViewMode.Hour:
				currentDate = addToDate(currentDate, 1, 'hour')
				break
		}

		dates.push(currentDate)
	}

	return dates
}
