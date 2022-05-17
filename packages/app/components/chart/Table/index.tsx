import { Table } from 'antd'

import styles from './index.less'

import type { TableProps } from 'antd'

interface IProps {
	height?: number
	columns: TableProps<any>['columns']
	data: Array<any>
}

const Index = (props: IProps) => {
	return (
		<div className={styles._local} style={{ height: props.height || 'auto' }}>
			<Table
				columns={props.columns}
				dataSource={props.data}
				rowKey={(item) => item.id}
				pagination={false}
			></Table>
		</div>
	)
}

export default window.$app.memo(Index)
