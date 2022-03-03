const Index = (list: Array<any>, word: string, key: string) => {
	const arr = []

	for (let i = 0; i < list.length; i++) {
		if (list[i][key].indexOf(word) >= 0) arr.push(list[i])
	}

	return arr
}

export default Index
