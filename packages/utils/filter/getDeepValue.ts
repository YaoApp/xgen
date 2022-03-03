const Index = (v: string, item: object) => {
      if (v.indexOf(':') !== -1) return v
      
	const key = v.replace(':', '')

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