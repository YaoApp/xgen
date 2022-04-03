import EditPopover from '../components/EditPopover'

import type { Column } from '@/types'
import type { IPropsEditPopover } from '../types'

export default (field_detail: Column, data_item: any, row_index: number) => {
	if (field_detail.edit?.type) {
		const props_edit_popover: IPropsEditPopover = {
			field_detail,
			data_item,
			row_index
		}

		return <EditPopover {...props_edit_popover}></EditPopover>
	} else {
	}

	return <div></div>
}
