import { useMemo } from 'react'

import { getLocale } from '@umijs/max'

import Block from '../components/Block'
import { getOperation, getRender, shouldGroupUpdate } from '../utils'

import type { IPropsPureTable, TableColumn } from '../types'
import type { Column, ViewComponents } from '@/types'

const hook = (
	columns: IPropsPureTable['columns'],
	props: IPropsPureTable['props'],
	operation: IPropsPureTable['operation']
) => {
	const locale = getLocale()
	const is_cn = locale === 'zh-CN'

	return useMemo(() => {
		if (!columns.length) return []

		const list_columns = columns.reduce(handleColumns, [])

		console.log(JSON.parse(JSON.stringify(operation)))

		const operation_col: TableColumn = {
			title: is_cn ? '操作' : 'operation',
			key: '__operation'
		}

		if (props.scroll) {
			operation_col['fixed'] = 'right'
			operation_col['className'] = 'scroll_table_options'
		}

		if (operation.fold) operation_col['width'] = 60
		if (operation.width) operation_col['width'] = operation.width
		if (!operation.hide) list_columns.push(operation_col)

		operation_col['render'] = (_, data_item) => {
			return getOperation(operation, data_item)
		}

		return list_columns
	}, [columns, props, operation])
}

const handleColumns = (total: Array<TableColumn>, raw_col_item: Column) => {
	const target_col_item: TableColumn = {}

	if (raw_col_item?.width) target_col_item['width'] = raw_col_item.width

	target_col_item['dataIndex'] = raw_col_item.bind
	target_col_item['title'] = raw_col_item.name

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
