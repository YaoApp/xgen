import styles from './index.less'

import type { IPropsActions } from '../../types'

const Index = (props: IPropsActions) => {
	const {} = props

	return <div className={styles._local}></div>
}

export default window.$app.memo(Index)
