import { getCachedDateTimeFormat } from './getCachedDateTimeFormat'

export const getLocaleMonth = (date: Date, locale: string) => {
	let bottomValue = getCachedDateTimeFormat(locale, {
		month: 'long'
	}).format(date)

	bottomValue = bottomValue.replace(bottomValue[0], bottomValue[0].toLocaleUpperCase())

	return bottomValue
}
