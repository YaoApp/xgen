import { getDeepValue } from '@yaoapp/utils'

import EditPopover from '../components/EditPopover'
import ViewContent from '../components/ViewContent'

import type { Column } from '@/types'
import type { IPropsEditPopover, IPropsViewContent } from '../types'

export default (field_detail: Column, data_item: any, row_index: number) => {
	const form_value = getDeepValue(field_detail.bind, data_item)

	if (field_detail.edit?.type) {
		const props_edit_popover: IPropsEditPopover = {
			field_detail,
			data_item,
			form_value,
			row_index
		}

		return <EditPopover {...props_edit_popover}></EditPopover>
	} else {
		const props_view_content: IPropsViewContent = {
			field_detail,
			data_item,
			form_value
		}

		return <ViewContent {...props_view_content}></ViewContent>
	}
}
