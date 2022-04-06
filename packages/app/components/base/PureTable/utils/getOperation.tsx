import FoldActions from '../components/FoldActions'
import UnfoldActions from '../components/UnfoldActions'

import type { TableSetting } from '@/types'
import type { IPropsPureTable, IPropsActions } from '../types'

export default (
	namespace: IPropsPureTable['namespace'],
	primary: IPropsPureTable['primary'],
	operation: TableSetting['table']['operation'],
	data_item: any
) => {
	const props_actions: IPropsActions = {
		namespace,
		primary,
		actions: operation.actions,
		data_item
	}

	if (operation.fold) {
		return <FoldActions {...props_actions}></FoldActions>
	} else {
		return <UnfoldActions {...props_actions}></UnfoldActions>
	}
}
