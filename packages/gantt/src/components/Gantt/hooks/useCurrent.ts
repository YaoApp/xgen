import { useEffect } from 'react'

import type { GanttProps, DateSetup } from '@/types'

interface HookProps extends Pick<Required<GanttProps>, 'columnWidth' | 'viewMode'>, Pick<GanttProps, 'viewDate'> {
	dateSetup: DateSetup
	currentViewDate: Date | undefined
	setCurrentViewDate: (v: Date) => void
	setScrollX: (v: number) => void
}

export default (props: HookProps) => {
	const { viewDate, columnWidth, dateSetup, viewMode, currentViewDate, setCurrentViewDate, setScrollX } = props

	useEffect(() => {
		if (
			viewMode === dateSetup.viewMode &&
			((viewDate && !currentViewDate) || (viewDate && currentViewDate?.valueOf() !== viewDate.valueOf()))
		) {
			const dates = dateSetup.dates

			const index = dates.findIndex(
				(d, i) =>
					viewDate.valueOf() >= d.valueOf() &&
					i + 1 !== dates.length &&
					viewDate.valueOf() < dates[i + 1].valueOf()
			)

			if (index === -1) return

			setCurrentViewDate(viewDate)
			setScrollX(columnWidth * index)
		}
	}, [viewDate, columnWidth, dateSetup.dates, dateSetup.viewMode, viewMode, currentViewDate])
}
