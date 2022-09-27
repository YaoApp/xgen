import { Table } from 'antd'

import styles from './index.less'

import type { TableProps } from 'antd'
import type { Component } from '@/types'

interface IProps extends Component.PropsChartComponent {
	height: number
	columns: TableProps<any>['columns']
	data: Array<any>
}

const Index = (props: IProps) => {
	return (
		<div className={styles._local} style={{ height: props.height || 'auto' }}>
			<Table
				columns={props.columns}
				dataSource={props.data}
				rowKey={(item) => item[Object.keys(item)[0]]}
				pagination={false}
			></Table>
		</div>
	)
}

export default window.$app.memo(Index)
