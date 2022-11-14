import clsx from 'clsx'
import { DotsSixVertical } from 'phosphor-react'

import styles from './index.less'

import type { IPropsRow } from '../../types'

const Index = (props: IPropsRow) => {
	const { dataItem } = props

	return (
		<div className={clsx([styles._local, 'w_100 flex align_center'])}>
			<span className={clsx([styles.handle, 'handle flex justify_center align_center transition_normal'])}>
				<DotsSixVertical size={18} weight='bold'></DotsSixVertical>
			</span>
			{dataItem.name}
		</div>
	)
}

export default window.$app.memo(Index)
