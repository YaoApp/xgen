import clsx from 'clsx'

import styles from './index.less'

import type { PropsWithChildren } from 'react'
import type { IPropsLoginWrapper } from '../../types'

const Index = (props: PropsWithChildren<IPropsLoginWrapper>) => {
	const { children } = props
	return <div className={clsx([styles._local, 'w_100vw h_100vh flex'])}>{children}</div>
}

export default window.$app.memo(Index)
