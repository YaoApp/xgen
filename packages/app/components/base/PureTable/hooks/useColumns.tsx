import { useMemo } from 'react'

import { getDeepValue } from '@yaoapp/utils'

import Block from '../components/Block'
import { getRender, shouldGroupUpdate } from '../utils'

import type { IPropsPureTable, TableColumn } from '../types'
import type { Column, ViewComponents } from '@/types'

const hook = (columns: IPropsPureTable['columns']) => {
	return useMemo(() => {
		if (!columns.length) return []

		const list_columns = columns.reduce(handleColumns, [])

		console.log(JSON.parse(JSON.stringify(columns)))
	}, [columns])
}

const handleColumns = (total: Array<TableColumn>, raw_col_item: Column) => {
	const target_col_item: TableColumn = {}

	if (raw_col_item?.width) target_col_item['width'] = raw_col_item.width

	target_col_item['dataIndex'] = raw_col_item.bind

	if (raw_col_item.view?.components) {
		target_col_item['render'] = (_: any, data_item: any) => (
			<Block
				type={raw_col_item.view?.type as string}
				components={raw_col_item.view?.components as ViewComponents}
				data_item={data_item}
			></Block>
		)

		/** For composite components, extract dependent fields and manually manage whether to update */
		target_col_item['shouldCellUpdate'] = (new_val: any, old_val: any) => {
			return shouldGroupUpdate(new_val, old_val, raw_col_item)
		}
	} else {
		target_col_item['render'] = (_: any, data_item: any) => {
			return getRender(raw_col_item, getDeepValue(raw_col_item.bind, data_item))
		}
	}

	total.push(target_col_item)

	return total
}

export default hook
