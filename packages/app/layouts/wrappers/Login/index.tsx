import clsx from 'clsx'

import Left from './components/Left'
import styles from './index.less'

import type { PropsWithChildren } from 'react'

const Index = ({ children }: PropsWithChildren<{}>) => {
	return (
		<div className={clsx([styles._local, 'w_100vw h_100vh flex'])}>
			<Left></Left>
			{children}
		</div>
	)
}

export default window.$app.memo(Index)
