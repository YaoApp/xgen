import type Model from '@/components/base/Table/model'
import type { TableColumnType } from 'antd'

export interface IPropsPureTable {
	parent: Model['parent']
	list: Model['list']
	columns: Model['table_columns']
	pagination: Model['pagination']
}

export type TableColumn = TableColumnType<any>
