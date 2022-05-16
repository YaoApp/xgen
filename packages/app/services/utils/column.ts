import { injectable } from 'tsyringe'

import type { Common, FormType, Chart } from '@/types'

type Item = { name: string }
type Fileds = { [key: string]: any }

@injectable()
export class ColumnUtils {
	private handleAnyColumn<I, F>(item: I & Item, fileds: F & Fileds) {
		const handled_item = fileds[item.name]
		const target_item = { ...item, ...handled_item }

		return target_item
	}

	private handleTableColumn(item: Common.BaseColumn, fileds: Common.Fileds) {
		const target_item = this.handleAnyColumn(item, fileds)

		if (target_item.view?.components) {
			target_item.view.components = Object.keys(target_item.view?.components).reduce(
				(components: { [key: string]: Common.FiledDetail }, key) => {
					components[key] = fileds[key]

					return components
				},
				{}
			)
		}

		return target_item
	}

	reduce(columns: Array<Common.BaseColumn>, fileds: Common.Fileds) {
		return columns.reduce((total: Array<Common.Column>, item) => {
			total.push(this.handleTableColumn(item, fileds))

			return total
		}, [])
	}

	reduceAny<I, O, F>(columns: Array<I & Item>, fileds: F & Fileds) {
		return columns.reduce((total: Array<O>, item) => {
			total.push(this.handleAnyColumn(item, fileds))

			return total
		}, [])
	}

	reduceSections(sections: Array<FormType.Section>, fileds: Common.Fileds) {
		const getSectionColumns = (
			total: Array<FormType.ColumnResult>,
			item: FormType.Column
		) => {
			if ('tabs' in item) {
				total.push({
					width: item?.width || 24,
					tabs: this.reduceSections(item.tabs, fileds)
				})
			} else {
				total.push(this.handleAnyColumn(item, fileds))
			}

			return total
		}

		return sections.reduce((total: Array<FormType.SectionResult>, item) => {
			total.push({
				title: item.title,
				desc: item.desc,
				columns: item.columns.reduce(getSectionColumns, [])
			})

			return total
		}, [])
	}
}
