import { useMemo } from 'react'

import { ViewMode } from '@/types'

import {
	getCalendarValuesForDay,
	getCalendarValuesForHour,
	getCalendarValuesForMonth,
	getCalendarValuesForPartOfDay,
	getCalendarValuesForQuarterYear,
	getCalendarValuesForWeek,
	getCalendarValuesForYear
} from '../utils'

import type { IPropsCalendar } from '../types'

interface HookProps extends IPropsCalendar {}

export default (props: HookProps) => {
	const { dateSetup, locale, viewMode, rtl, headerHeight, columnWidth, fontFamily, fontSize } = props

	return useMemo(() => {
		switch (dateSetup.viewMode) {
			case ViewMode.Year:
				return getCalendarValuesForYear({ columnWidth, dateSetup, headerHeight, rtl })
				break
			case ViewMode.QuarterYear:
				return getCalendarValuesForQuarterYear({ columnWidth, dateSetup, headerHeight, rtl })
				break
			case ViewMode.Month:
				return getCalendarValuesForMonth({ columnWidth, dateSetup, headerHeight, rtl, locale })
				break
			case ViewMode.Week:
				return getCalendarValuesForWeek({ columnWidth, dateSetup, headerHeight, rtl, locale })
				break
			case ViewMode.Day:
				return getCalendarValuesForDay({ columnWidth, dateSetup, headerHeight, locale })
				break
			case ViewMode.QuarterDay:
			case ViewMode.HalfDay:
				return getCalendarValuesForPartOfDay({
					columnWidth,
					dateSetup,
					headerHeight,
					rtl,
					locale,
					fontFamily,
					viewMode
				})
				break
			case ViewMode.Hour:
				return getCalendarValuesForHour({
					columnWidth,
					dateSetup,
					headerHeight,
					rtl,
					locale,
					fontFamily
				})
		}
	}, [dateSetup, locale, viewMode, rtl, headerHeight, columnWidth, fontFamily, fontSize])
}
