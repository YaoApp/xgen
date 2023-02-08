export const getWeekNumberISO8601 = (date: Date) => {
	const tmpDate = new Date(date.valueOf())
      const dayNumber = (tmpDate.getDay() + 6) % 7
      
      tmpDate.setDate(tmpDate.getDate() - dayNumber + 3)
      
      const firstThursday = tmpDate.valueOf()
      
      tmpDate.setMonth(0, 1)
      
	if (tmpDate.getDay() !== 4) {
		tmpDate.setMonth(0, 1 + ((4 - tmpDate.getDay() + 7) % 7))
      }
      
	const weekNumber = (1 + Math.ceil((firstThursday - tmpDate.valueOf()) / 604800000)).toString()

	if (weekNumber.length === 1) {
		return `0${weekNumber}`
	} else {
		return weekNumber
	}
}
