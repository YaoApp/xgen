import Block from '../components/Block'
import { Render, shouldGroupUpdate, shouldViewUpdate } from '../utils'

import type { Common } from '@/types'
import type { IPropsPureTable, TableColumn } from '../types'

type Elements = { [key: string]: JSX.Element }

export default (
	namespace: IPropsPureTable['namespace'],
	primary: IPropsPureTable['primary'],
	columns: IPropsPureTable['columns']
) => {
	const handleColumn = (total: Array<TableColumn>, raw_col_item: Common.TableColumn) => {
		const target_col_item: TableColumn = {}

		if (raw_col_item?.width) target_col_item['width'] = raw_col_item.width
		if (raw_col_item?.fixed) target_col_item['fixed'] = raw_col_item.fixed

		target_col_item['dataIndex'] = raw_col_item.bind
		target_col_item['title'] = raw_col_item.name

		if (raw_col_item.view?.props?.components) {
			target_col_item['shouldCellUpdate'] = (new_val, old_val) => {
				return shouldGroupUpdate(new_val, old_val, raw_col_item)
			}

			target_col_item['render'] = (_, data_item) => (
				<Block
					namespace={namespace}
					primary={primary}
					type={raw_col_item.view.type as string}
					components={raw_col_item.view.props.components as Common.ViewComponents}
					data_item={data_item}
				></Block>
			)
		} else {
			if (raw_col_item?.view?.bind) {
				target_col_item['dataIndex'] = raw_col_item.view.bind
			}

			target_col_item['shouldCellUpdate'] = (new_val, old_val) => {
				return shouldViewUpdate(new_val, old_val, target_col_item.dataIndex as string)
			}

			target_col_item['render'] = (_, data_item) => {
				return <Render {...{ namespace, primary, data_item }} field_detail={raw_col_item} />
			}
		}

		total.push(target_col_item)

		return total
	}

	return columns.reduce(handleColumn, [])
}
