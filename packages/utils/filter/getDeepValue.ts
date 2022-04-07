type Key = string

type Params = {
	[key: string]: string
}

const Index = (param: Key | Params, data_item: any) => {
      if (!param) return {}
      
	if (typeof param === 'string') {
		if (param.indexOf('.') !== -1) {
			const indexs = param.split('.')

			return indexs.reduce((total: any, it: any) => {
				total = total[it]

				return total
			}, data_item)
		}

		return data_item[param]
	} else {
		return Object.keys(param).reduce((total: any, key: string) => {
			if (param[key].indexOf(':') !== -1) {
				total[key] = Index(key.replace(':', ''), data_item)
			} else {
				total[key] = param[key]
			}

			return total
		}, {})
	}
}

export default Index
