import { injectable } from 'tsyringe'

import type { Common, FormType, Chart } from '@/types'

type Item = { name: string }
type Fields = { [key: string]: any }

@injectable()
export class ColumnUtils {
	private handleAnyColumn<I, F>(item: I & Item, fields: F & Fields) {
		const handled_item = fields[item.name]
		const target_item = { ...item, ...handled_item }

		return target_item
	}

	private handleTableColumn(item: Common.BaseColumn, fields: Common.Fields) {
		const target_item = this.handleAnyColumn(item, fields)

		if (target_item.view?.components) {
			target_item.view.components = Object.keys(target_item.view?.components).reduce(
				(components: { [key: string]: Common.FiledDetail }, key) => {
					components[key] = fields[key]

					return components
				},
				{}
			)
		}

		return target_item
	}

	reduce(columns: Array<Common.BaseColumn>, fields: Common.Fields) {
		return columns.reduce((total: Array<Common.Column>, item) => {
			total.push(this.handleTableColumn(item, fields))

			return total
		}, [])
	}

	reduceAny<I, O, F>(columns: Array<I & Item>, fields: F & Fields) {
		return columns.reduce((total: Array<O>, item) => {
			total.push(this.handleAnyColumn(item, fields))

			return total
		}, [])
	}

	reduceSections(sections: Array<FormType.Section>, fields: Common.Fields) {
		const getSectionColumns = (
			total: Array<FormType.ColumnResult>,
			item: FormType.Column
		) => {
			if ('tabs' in item) {
				total.push({
					width: item?.width || 24,
					tabs: this.reduceSections(item.tabs, fields)
				})
			} else {
				total.push(this.handleAnyColumn(item, fields))
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
