import Actions from '../Actions'
import Fields from '../Fields'

import type { IPropsRow } from '../../types'

const Index = (props: IPropsRow) => {
	const { setting, showLabel, dataItem, parentIds, fold, onAction, onChange } = props

	return (
		<div className='w_100 flex align_start' style={{ marginBottom: 12 }}>
			<Fields {...{ setting, showLabel, dataItem, parentIds, onChange }}></Fields>
			<Actions {...{ parentIds, fold, onAction }} hasChildren={dataItem?.children?.length > 0}></Actions>
		</div>
	)
}

export default window.$app.memo(Index)
