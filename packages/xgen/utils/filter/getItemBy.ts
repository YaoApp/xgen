import { find } from 'lodash-es'

const Index = (key: string, items: Array<any>, keys: Array<string | number>) => {
	return keys.reduce((total, v) => {
		const target = find(items, (item) => item[key] === v)

		if (target?.children?.length) {
			keys.shift()

			total = Index(key, target.children, keys)
		} else {
			total = target
		}

		return total
	}, {} as any)
}

export default Index
