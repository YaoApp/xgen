import { Table } from 'antd'

import { getLocale } from '@umijs/max'

import { useColumns } from './hooks'
import locales from './locales'

import type { TablePaginationConfig } from 'antd'
import type { IPropsPureTable } from './types'

const Index = (props: IPropsPureTable) => {
	const {
		parent,
		namespace,
		primary,
		list,
		columns,
		pagination,
		props: table_props,
		operation,
		hidePagination
	} = props
	const locale = getLocale()
	const in_form = parent === 'Form'

	const list_columns = useColumns(namespace, primary, columns, table_props, operation)

	const table_pagination: TablePaginationConfig = {
		current: Number(pagination.page) || 1,
		pageSize: Number(pagination.pagesize) || 10,
		total: pagination.total,
		showSizeChanger: true,
		showTotal: (total: number) =>
			locales[locale].pagination.total.before +
			total +
			locales[locale].pagination.total.after
	}

	return (
		<Table
			dataSource={list}
			columns={list_columns}
			sticky={in_form || hidePagination ? false : { offsetHeader: 52 }}
			rowKey={(item) => item.id || item[Object.keys(item)[0]]}
			pagination={hidePagination ? false : table_pagination}
			onChange={({ current: page, pageSize: pagesize }) => {
				window.$app.Event.emit(`${namespace}/search`, { page, pagesize })
			}}
			{...table_props}
		/>
	)
}

export default window.$app.memo(Index)
