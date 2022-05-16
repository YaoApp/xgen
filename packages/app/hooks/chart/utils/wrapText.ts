export default (value: string, textWrap: boolean, textLength: number) => {
	if (!textWrap) return value

	const maxLength = textLength || 5
	const valLength = value.length
	const rowN = Math.ceil(valLength / maxLength)
	let ret = ''

	if (rowN > 1) {
		for (let i = 0; i < rowN; i++) {
			const start = i * maxLength
			const end = start + maxLength
			let temp = ''

			temp = value.substring(start, end) + '\n'
			ret += temp
		}

		return ret
	} else {
		return value
	}
}
