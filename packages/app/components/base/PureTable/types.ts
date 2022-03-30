import type Model from '@/components/base/Table/model'

export interface IPropsPureTable {
	parent: Model['parent']
	list: Model['list']
	columns: Model['table_columns']
	pagination: Model['pagination']
}
