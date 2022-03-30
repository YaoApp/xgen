import { Table } from 'antd'
import clsx from 'clsx'

import styles from './index.less'

import type { IPropsPureTable } from './types'

const Index = (props: IPropsPureTable) => {
	const { parent, list, columns, pagination } = props
      const in_modal = parent === 'Modal'
      
	console.log(JSON.stringify(columns))
	console.log(JSON.stringify(pagination))


	const table_pagination = {
		current: Number(pagination.page) || 1,
		pageSize: Number(pagination.pagesize) || 10,
		total: pagination.total,
		showSizeChanger: true
	}

	return (
		// <Table
		// 	className={clsx([styles._local, in_modal ? styles.inline : ''])}
		// 	dataSource={list}
		// 	columns={[]}
		// 	sticky={in_modal ? false : { offsetHeader: 52 }}
		// 	rowKey={(item) => item.id}
		// 	pagination={in_modal ? false : table_pagination}
		// />

		<div>123</div>
	)
}

export default window.$app.memo(Index)
