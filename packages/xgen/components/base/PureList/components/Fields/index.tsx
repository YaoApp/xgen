import styles from './index.less'

import type { IPropsFields } from '../../types'

const Index = (props: IPropsFields) => {
	const { dataItem } = props

	return <div className={styles._local}>{dataItem.name || dataItem.id}</div>
}

export default window.$app.memo(Index)
