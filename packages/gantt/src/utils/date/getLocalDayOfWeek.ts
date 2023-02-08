import { getCachedDateTimeFormat } from './getCachedDateTimeFormat'

export const getLocalDayOfWeek = (date: Date, locale: string, format?: 'long' | 'short' | 'narrow' | undefined) => {
	let bottomValue = getCachedDateTimeFormat(locale, {
		weekday: format
      }).format(date)
      
      bottomValue = bottomValue.replace(bottomValue[ 0 ], bottomValue[ 0 ].toLocaleUpperCase())
      
	return bottomValue
}
