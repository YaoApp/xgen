import { useMemo } from 'react'

import Block from '../components/Block'
import { getRender, shouldGroupUpdate } from '../utils'

import type { IPropsPureTable, TableColumn } from '../types'
import type { Column, ViewComponents } from '@/types'

const hook = (columns: IPropsPureTable['columns']) => {
	return useMemo(() => {
		if (!columns.length) return []

		const list_columns = columns.reduce(handleColumns, [])

		return list_columns
	}, [columns])
}

const handleColumns = (total: Array<TableColumn>, raw_col_item: Column) => {
	const target_col_item: TableColumn = {}

	if (raw_col_item?.width) target_col_item['width'] = raw_col_item.width

	target_col_item['dataIndex'] = raw_col_item.bind

	if (raw_col_item.view?.components) {
		target_col_item['render'] = (_, data_item, row_index) => (
			<Block
				type={raw_col_item.view.type as string}
				components={raw_col_item.view.components as ViewComponents}
				data_item={data_item}
				row_index={row_index}
			></Block>
		)

		/** For composite components, extract dependent fields and manually manage whether to update */
		target_col_item['shouldCellUpdate'] = (new_val, old_val) => {
			return shouldGroupUpdate(new_val, old_val, raw_col_item)
		}
	} else {
		target_col_item['render'] = (_, data_item, row_index) => {
			return getRender(raw_col_item, data_item, row_index)
		}
	}

	total.push(target_col_item)

	return total
}

export default hook
