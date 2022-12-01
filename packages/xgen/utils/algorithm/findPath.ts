import { cloneDeep, omit } from 'lodash-es'

export default (data: Array<any>, key: string, value: any) => {
	let result: Array<any> = []

	const traverse = (data: Array<any>, paths: Array<any>) => {
		if (data.length === 0) return

		for (let item of data) {
			paths.push(omit(item, 'children'))

			if (item[key] === value) return (result = cloneDeep(paths))

			const children = Array.isArray(item.children) ? item.children : []

			traverse(children, paths)

			paths.pop()
		}
	}

	traverse(data, [])

	return result
}
