import clsx from 'clsx'

import styles from './index.less'

import type { IPropsPureForm } from './types'

const Index = (props: IPropsPureForm) => {
	const {} = props

	return <div className={clsx([styles._local])}>123</div>
}

export default window.$app.memo(Index)
