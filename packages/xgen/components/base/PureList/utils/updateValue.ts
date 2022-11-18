import { cloneDeep, findIndex } from 'lodash-es'

export default (list: Array<any>, v: any, parentIds: Array<string | number>) => {
	const _list = cloneDeep(list)

	parentIds.reduce((total, key, idx) => {
		if (!total) return

		const index = findIndex(total, (item) => item.id === key)

		if (parentIds.length - 1 === idx) {
			total[index] = { ...total[index], ...v }
		}

		return total[index]?.children
	}, _list)

	return _list
}
