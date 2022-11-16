import clsx from 'clsx'

import Actions from '../Actions'
import Fields from '../Fields'
import styles from './index.less'

import type { IPropsRow } from '../../types'

const Index = (props: IPropsRow) => {
	const { setting, showLabel, dataItem, parentIds, fold, onAction } = props

	return (
		<div className={clsx([styles._local, 'w_100 flex align_start'])}>
			<Fields {...{ setting, showLabel, dataItem }}></Fields>
			<Actions {...{ parentIds, fold, onAction }} hasChildren={dataItem?.children?.length > 0}></Actions>
		</div>
	)
}

export default window.$app.memo(Index)
