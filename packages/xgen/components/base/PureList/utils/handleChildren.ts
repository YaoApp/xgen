import { cloneDeep, findIndex } from 'lodash-es'

import createId from './createId'

import type { ActionType } from '../types'

export default (list: Array<any>, type: ActionType, parentIds: Array<string | number>) => {
	const _list = cloneDeep(list)

	parentIds.reduce((total, key, idx) => {
		if (!total) return

		const index = findIndex(total, (item) => item.id === key)

		if (parentIds.length - 1 === idx) {
			switch (type) {
				case 'fold':
					if (!total[index]?._fold) {
						total[index]['_fold'] = true
					} else {
						total[index]._fold = !total[index]._fold
					}
					break
				case 'add':
					total.splice(index + 1, 0, { id: createId() })
					break
				case 'addChild':
					if (!total[index]?.children) {
						total[index]['children'] = [{ id: createId() }]
					} else {
						total[index].children.push({ id: createId() })
					}
					break
				case 'remove':
					total.splice(index, 1)
					break

				default:
					break
			}
		}

		return total[index]?.children
	}, _list)

	return _list
}
