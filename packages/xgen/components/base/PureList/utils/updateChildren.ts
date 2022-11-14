import { cloneDeep, findIndex } from 'lodash-es'

export default (list: Array<any>, v: Array<any>, parentIds: Array<string>) => {
	const _list = cloneDeep(list)

	parentIds.reduce((total, key, idx) => {
		const index = findIndex(total, (item) => item.id === key)

		if (!total[index]?.children) return

		if (parentIds.length - 1 === idx) {
			total[index].children = v
		}

		return total[index].children
	}, _list)

	return _list
}
