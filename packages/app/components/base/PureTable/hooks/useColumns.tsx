import { useMemo } from 'react'

import { getLocale } from '@umijs/max'

import { getColumns, getOperation } from '../utils'

import type { IPropsPureTable, TableColumn } from '../types'

const hook = (
	namespace: IPropsPureTable['namespace'],
	primary: IPropsPureTable['primary'],
	columns: IPropsPureTable['columns'],
	props: IPropsPureTable['props'],
	operation: IPropsPureTable['operation']
) => {
	const locale = getLocale()
	const is_cn = locale === 'zh-CN'

	return useMemo(() => {
		if (!columns.length) return []

		const list_columns = getColumns(namespace, primary, columns)

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
			return getOperation(namespace, primary, operation, data_item)
		}

		return list_columns
	}, [columns, props, operation])
}

export default hook
