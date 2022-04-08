import { injectable } from 'tsyringe'

import type { Common, FormType } from '@/types'

@injectable()
export default class Index {
	reduce(columns: Array<Common.BaseColumn>, fileds: Common.Fileds) {
		return columns.reduce((total: Array<Common.Column>, item) => {
			const handled_item = fileds[item.name]
			const target_item = { ...item, ...handled_item }

			if (target_item.view?.components) {
				target_item.view.components = Object.keys(
					target_item.view?.components
				).reduce((components: { [key: string]: Common.FiledDetail }, key) => {
					components[key] = fileds[key]

					return components
				}, {})
			}

			total.push(target_item)

			return total
		}, [])
	}

	reduceSections(sections: Array<FormType.Section>, fileds: Common.Fileds) {
		return sections.reduce((total: any, item) => {
			total['title'] = item.title

			return total
		}, [])
	}
}
