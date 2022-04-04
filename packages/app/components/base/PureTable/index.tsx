import { Table } from 'antd'
import clsx from 'clsx'

import useColumns from './hooks/useColumns'
import styles from './index.less'

import type { IPropsPureTable } from './types'

const Index = (props: IPropsPureTable) => {
	const { parent, list, columns, pagination, props: table_props, operation } = props
	const is_inner = parent === 'Modal'

	const list_columns = useColumns(columns, table_props, operation)

	const table_pagination = {
		current: Number(pagination.page) || 1,
		pageSize: Number(pagination.pagesize) || 10,
		total: pagination.total,
		showSizeChanger: true
	}

	return (
		<Table
			className={clsx([styles._local, is_inner ? styles.inline : ''])}
			dataSource={list}
			columns={list_columns}
			sticky={is_inner ? false : { offsetHeader: 52 }}
			rowKey={(item) => item.id}
			pagination={is_inner ? false : table_pagination}
			{...table_props}
		/>
	)
}

export default window.$app.memo(Index)
