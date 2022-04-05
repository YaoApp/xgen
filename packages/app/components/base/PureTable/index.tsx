import { Table } from 'antd'
import clsx from 'clsx'

import { getLocale } from '@umijs/max'

import { useColumns } from './hooks'
import styles from './index.less'
import locales from './locales'

import type { TablePaginationConfig } from 'antd'
import type { IPropsPureTable } from './types'

const Index = (props: IPropsPureTable) => {
	const { parent, namespace, list, columns, pagination, props: table_props, operation } = props
	const locale = getLocale()
	const is_inner = parent === 'Modal'

	const list_columns = useColumns(columns, table_props, operation)

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
			className={clsx([styles._local, is_inner ? styles.inline : ''])}
			dataSource={list}
			columns={list_columns}
			sticky={is_inner ? false : { offsetHeader: 52 }}
			rowKey={(item) => item.id}
			pagination={is_inner ? false : table_pagination}
			onChange={({ current: page, pageSize: pagesize }) => {
				window.$app.Event.emit(`${namespace}/search`, { page, pagesize })
			}}
			{...table_props}
		/>
	)
}

export default window.$app.memo(Index)
