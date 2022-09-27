import clsx from 'clsx'

import Left from './components/Left'
import styles from './index.less'

import type { PropsWithChildren } from 'react'
import type { IPropsLoginWrapper } from '../../types'

const Index = (props: PropsWithChildren<IPropsLoginWrapper>) => {
	const { children, logo, layout } = props

	const props_left: Pick<IPropsLoginWrapper, 'logo' | 'layout'> = {
		logo,
		layout
	}

	return (
		<div className={clsx([styles._local, 'w_100vw h_100vh flex'])}>
			<Left {...props_left}></Left>
			{children}
		</div>
	)
}

export default window.$app.memo(Index)
