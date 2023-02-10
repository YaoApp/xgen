const localeDateStringCache = {}

export default (locale: string) => (date: Date) => {
	const key = date.toString()
	let lds = localeDateStringCache[key]

	if (!lds) {
		lds = date.toLocaleDateString(locale, {
			weekday: 'short',
			year: 'numeric',
			month: 'long',
			day: 'numeric'
            })
            
		localeDateStringCache[key] = lds
	}

	return lds
}
