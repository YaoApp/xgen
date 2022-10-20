import { getDeepValue } from '@/knife'
import { getTemplateValue } from '@/utils'

import EditPopover from '../components/EditPopover'
import ViewContent from '../components/ViewContent'

import type { Common } from '@/types'
import type { IPropsComponentCommon } from '../types'

export default (
	namespace: IPropsComponentCommon['namespace'],
	primary: IPropsComponentCommon['primary'],
	field_detail: Common.Column,
	data_item: any
) => {
	let form_value_view = null
	let form_value_edit = null

	const form_value = getDeepValue(field_detail.bind, data_item)

	if (field_detail?.view?.bind) {
		form_value_view = getDeepValue(field_detail.view.bind, data_item)
	}

	if (field_detail?.edit?.bind) {
		form_value_edit = getDeepValue(field_detail.edit.bind, data_item)
	}

	const props_common: Omit<IPropsComponentCommon, 'form_value'> = {
		namespace,
		primary,
		field_detail: getTemplateValue(field_detail, data_item),
		data_item
	}

	if (field_detail.edit?.type) {
		return (
			<EditPopover
				{...props_common}
				form_value={form_value_edit ?? form_value}
			></EditPopover>
		)
	} else {
		return (
			<ViewContent
				{...props_common}
				form_value={form_value_view ?? form_value}
			></ViewContent>
		)
	}
}
