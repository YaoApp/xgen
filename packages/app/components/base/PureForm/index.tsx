import clsx from 'clsx'

import styles from './index.less'

const Index = () => {
	return <div className={clsx([styles._local])}>123</div>
}

export default window.$app.memo(Index)
