import { cloneDeep, omit } from 'lodash-es'

export default (data: Array<any>, key: string, value: any) => {
	let result: Array<any> = []

	const traverse = (data: Array<any>, paths: Array<any>) => {
		if (data.length === 0) return

		for (let item of data) {
			paths.push(omit(item, 'children'))

			// If the key and value are matched, return the path
			if (key == 'key' && item.key && item.key != '') {
				const itemRoute = item.key.split('/_menu')[0]
				const findRoute = value.split('/_menu')[0]
				if (itemRoute === findRoute && item.key.includes(value)) return (result = cloneDeep(paths))
			}

			if (item.key === value || item[key] === value) return (result = cloneDeep(paths))

			const children = Array.isArray(item.children) ? item.children : []

			traverse(children, paths)

			paths.pop()
		}
	}

	traverse(data, [])

	return result
}
