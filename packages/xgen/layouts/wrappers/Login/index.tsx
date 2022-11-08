import clsx from 'clsx'

import { useLocation } from '@umijs/max'

import Left from './components/Left'
import styles from './index.less'

import type { PropsWithChildren } from 'react'
import type { IPropsLoginWrapper, IPropsLoginWrapperLeft } from '../../types'

const Index = (props: PropsWithChildren<IPropsLoginWrapper>) => {
	const { children, logo, admin, user } = props
	const { pathname } = useLocation()
	const is_admin = pathname.indexOf('/admin') !== -1

	const props_left: IPropsLoginWrapperLeft = {
		logo,
		layout: is_admin ? admin?.layout : user?.layout
	}

	return (
		<div className={clsx([styles._local, 'w_100vw h_100vh flex'])}>
			<Left {...props_left}></Left>
			{children}
		</div>
	)
}

export default window.$app.memo(Index)
