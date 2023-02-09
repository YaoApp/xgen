import { useMemo } from 'react'

import { addToDate } from '@/utils'

import type { IPropsGrid } from '../types'
import type { ReactElement } from 'react'

interface HookProps extends Pick<IPropsGrid, 'dates' | 'columnWidth' | 'todayColor' | 'rtl'> {
	y: number
}

export default (props: HookProps) => {
	const { dates, columnWidth, todayColor, rtl, y } = props

	return useMemo(() => {
		const now = new Date()
		const ticks: ReactElement[] = []
		let tickX = 0
		let today: ReactElement = <rect />

		for (let i = 0; i < dates.length; i++) {
			const date = dates[i]

			ticks.push(<line className='gridTick' x1={tickX} y1={0} x2={tickX} y2={y} key={date.getTime()} />)

			const condition_1 =
				i + 1 !== dates.length &&
				date.getTime() < now.getTime() &&
				dates[i + 1].getTime() >= now.getTime()

			const condition_2 =
				i !== 0 &&
				i + 1 === dates.length &&
				date.getTime() < now.getTime() &&
				addToDate(date, date.getTime() - dates[i - 1].getTime(), 'millisecond').getTime() >=
					now.getTime()

			if (condition_1 || condition_2) {
				today = <rect x={tickX} y={0} width={columnWidth} height={y} fill={todayColor} />
			}

			if (
				rtl &&
				i + 1 !== dates.length &&
				date.getTime() >= now.getTime() &&
				dates[i + 1].getTime() < now.getTime()
			) {
				today = <rect x={tickX + columnWidth} y={0} width={columnWidth} height={y} fill={todayColor} />
			}

			tickX += columnWidth
		}

		return { ticks, today }
	}, [dates, columnWidth, todayColor, rtl, y])
}
