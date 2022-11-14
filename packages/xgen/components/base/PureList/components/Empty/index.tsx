import { Empty } from 'antd'
import clsx from 'clsx'

import styles from './index.less'

const Index = () => {
	return (
		<div className={clsx([styles._local, 'w_100 flex justify_center'])}>
			<Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
		</div>
	)
}

export default window.$app.memo(Index)
