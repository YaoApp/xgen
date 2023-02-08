import type { DateTimeFormat, DateTimeFormatOptions } from '@/types'

const intlCache = {}

export const getCachedDateTimeFormat = (
	locale: string | string[],
	opts: DateTimeFormatOptions = {}
): DateTimeFormat => {
	const key = JSON.stringify([locale, opts])

	let dtf = intlCache[key]

	if (!dtf) {
		dtf = new Intl.DateTimeFormat(locale, opts)

		intlCache[key] = dtf
	}

	return dtf
}
