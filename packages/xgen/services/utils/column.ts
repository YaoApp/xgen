import { injectable } from 'tsyringe'

import type { Common, FormType, Dashboard } from '@/types'

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

		if (target_item.view?.props?.components) {
			const raw_components = target_item.view.props.components

			target_item.view.props.components = Object.keys(raw_components).reduce(
				(components: { [key: string]: string | Common.FieldDetail }, key) => {
					const field_key = raw_components[key]

					if (typeof field_key === 'string') {
						components[key] = fields[field_key]
					} else {
						components[key] = field_key
					}

					return components
				},
				{}
			)
		}

		return target_item
	}

	reduce(columns: Array<Common.BaseColumn>, fields: Common.Fields) {
		return (columns || []).reduce((total: Array<Common.Column>, item) => {
			total.push(this.handleTableColumn(item, fields))

			return total
		}, [])
	}

	reduceAny<I, O, F>(columns: Array<I & Item>, fields: F & Fields) {
		return (columns || []).reduce((total: Array<O>, item) => {
			total.push(this.handleAnyColumn(item, fields))

			return total
		}, [])
	}

	reduceSections(sections: Array<FormType.Section>, fields: Common.EditFields) {
		const getColumns = (total: Array<FormType.ColumnResult>, item: FormType.Column) => {
			if ('tabs' in item) {
				total.push({
					width: item?.width || 24,
					icon: item.icon,
					color: item.color,
					weight: item.weight,
					tabs: this.reduceSections(item.tabs, fields)
				})
			} else {
				total.push(this.handleAnyColumn(item, fields))
			}

			return total
		}

		return (sections || []).reduce((total: Array<FormType.SectionResult>, item) => {
			total.push({
				title: item.title,
				desc: item.desc,
				icon: item.icon,
				color: item.color,
				weight: item.weight,
				columns: (item.columns || []).reduce(getColumns, [])
			})

			return total
		}, [])
	}

	reduceDashboardColumns(columns: Array<Dashboard.Column>, fields: Common.ViewFields) {
		const getColumns = (total: Array<Dashboard.TargetColumn>, item: Dashboard.Column) => {
			if ('rows' in item) {
				total.push({
					width: item.width,
					rows: this.reduceDashboardColumns(item.rows, fields)
				})
			} else {
				total.push(this.handleAnyColumn(item, fields))
			}

			return total
		}

		return (columns || []).reduce((total: Array<Dashboard.TargetColumn>, item) => {
			if ('rows' in item) {
				total.push({
					width: item.width,
					rows: (item.rows || []).reduce(getColumns, [])
				})
			} else {
				total.push(this.handleAnyColumn(item, fields))
			}

			return total
		}, [])
	}
}
