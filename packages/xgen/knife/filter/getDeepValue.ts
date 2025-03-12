type Key = string

type Params = {
	[key: string]: string
}

const Index = (param: Key | Params, data_item: any) => {
	if (!param) return
	if (!data_item) return
	if (!Object.keys(data_item).length) return

	if (typeof param === 'string') {
		let real_param = param

		if (param.indexOf(':') !== -1) {
			real_param = param.replace(':', '')
		}

		if (real_param.indexOf('.') !== -1) {
			const indexs = real_param.split('.')

			return indexs.reduce((total: any, it: any) => {
				if (total === null || total === undefined) return undefined
				total = total[it]
				return total
			}, data_item)
		}

		return data_item[real_param]
	} else {
		return Object.keys(param).reduce((total: any, key: string) => {
			if (param[key].indexOf(':') !== -1) {
				total[key] = Index(param[key].replace(':', ''), data_item)
			} else {
				total[key] = param[key]
			}

			return total
		}, {})
	}
}

export default Index
