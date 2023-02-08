import type { DateScales } from '@/types'

const scores = ['millisecond', 'second', 'minute', 'hour', 'day', 'month', 'year']

const shouldReset = (scale: DateScales, _scale: DateScales) => {
	return scores.indexOf(_scale) <= scores.indexOf(scale)
}

export const startOfDate = (date: Date, scale: DateScales) => {
	return new Date(
		date.getFullYear(),
		shouldReset(scale, 'year') ? 0 : date.getMonth(),
		shouldReset(scale, 'month') ? 1 : date.getDate(),
		shouldReset(scale, 'day') ? 0 : date.getHours(),
		shouldReset(scale, 'hour') ? 0 : date.getMinutes(),
		shouldReset(scale, 'minute') ? 0 : date.getSeconds(),
		shouldReset(scale, 'second') ? 0 : date.getMilliseconds()
	)
}
