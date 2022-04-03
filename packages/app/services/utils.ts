import { injectable } from 'tsyringe'

import type { BaseColumn, Fileds, FiledDetail, Column } from '@/types/table'

@injectable()
export default class Index {
	reduce(columns: Array<BaseColumn>, fileds: Fileds) {
		return columns.reduce((total: Array<Column>, item) => {
			const handled_item = fileds[item.name]
			const target_item = { ...item, ...handled_item }

			if (target_item.view?.components) {
				target_item.view.components = Object.keys(
					target_item.view?.components
				).reduce((components: { [key: string]: FiledDetail }, key) => {
					components[key] = fileds[key]

					return components
				}, {})
			}

			total.push(target_item)

			return total
		}, [])
	}
}
