import FoldActions from '../components/FoldActions'
import UnfoldActions from '../components/UnfoldActions'

import type { TableSetting } from '@/types'
import type { IPropsActions } from '../types'

export default (operation: TableSetting['table']['operation'], data_item: any) => {
	const props_actions: IPropsActions = {
		actions: operation.actions,
		data_item
	}

	if (operation.fold) {
		return <FoldActions {...props_actions}></FoldActions>
	} else {
		return <UnfoldActions {...props_actions}></UnfoldActions>
	}
}
