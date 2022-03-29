import { injectable } from 'tsyringe'

import type { BaseColumn, Fileds, Column } from '@/types/table'

@injectable()
export default class Index {
	reduce(columns: Array<BaseColumn>, fileds: Fileds) {
		return columns.reduce((total: Array<Column>, item) => {
			total.push({
				...item,
				...fileds[item.name]
			})

			return total
		}, [])
	}
}
