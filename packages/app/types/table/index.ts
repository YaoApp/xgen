import type Filter from './filter'
import type Header from './header'
import type Actions from './actions'
import type { TableProps } from 'antd'
import type { BaseColumn, Fileds } from './common'

export interface SettingTable {
	header: Header
	filter: Filter
	table: {
		props: TableProps<{}>
		columns: Array<BaseColumn>
		actions: Actions
	}
	fileds: {
		filter: Fileds
		table: Fileds
	}
}
