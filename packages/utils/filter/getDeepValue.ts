const Index = (key: string, item: any) => {
	if (key.indexOf('.') !== -1) {
		const indexs = key.split('.')

		return indexs.reduce((total: any, it: any) => {
			total = total[it]

			return total
		}, item)
	}

	return item[key]
}

export default Index