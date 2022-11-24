import { useDeepCompareLayoutEffect } from 'ahooks'
import { useState } from 'react'

import { getLocale } from '@umijs/max'

import { getColumns, getOperation } from '../utils'

import type { IPropsPureTable, TableColumn } from '../types'
import type { TableProps } from 'antd'

const hook = (
	namespace: IPropsPureTable['namespace'],
	primary: IPropsPureTable['primary'],
	columns: IPropsPureTable['columns'],
	scroll: TableProps<any>['scroll'],
	operation: IPropsPureTable['operation']
) => {
	const locale = getLocale()
	const [list_columns, setListColumns] = useState<Array<TableColumn>>([])
	const is_cn = locale === 'zh-CN'

	useDeepCompareLayoutEffect(() => {
		if (!columns.length) return setListColumns([])

		const list_columns = getColumns(namespace, primary, columns)

		const operation_col: TableColumn = {
			title: is_cn ? '操作' : 'operation',
			key: '__operation'
		}

		if (scroll) {
			operation_col['fixed'] = 'right'
		}

		if (operation.fold) operation_col['width'] = 60
		if (operation.width) operation_col['width'] = operation.width
		if (!operation.hide) list_columns.push(operation_col)

		operation_col['render'] = (_, data_item) => {
			return getOperation(namespace, primary, operation, data_item)
		}

		setListColumns(list_columns)
	}, [columns, scroll, operation])

	return list_columns
}

export default hook
