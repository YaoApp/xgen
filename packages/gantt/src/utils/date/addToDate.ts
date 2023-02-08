import type { DateScales } from '@/types'

export const addToDate = (date: Date, quantity: number, scale: DateScales) => {
	return new Date(
		date.getFullYear() + (scale === 'year' ? quantity : 0),
		date.getMonth() + (scale === 'month' ? quantity : 0),
		date.getDate() + (scale === 'day' ? quantity : 0),
		date.getHours() + (scale === 'hour' ? quantity : 0),
		date.getMinutes() + (scale === 'minute' ? quantity : 0),
		date.getSeconds() + (scale === 'second' ? quantity : 0),
		date.getMilliseconds() + (scale === 'millisecond' ? quantity : 0)
	)
}
