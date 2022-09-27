import { getDeepValue } from '@/knife'

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
	const form_value = getDeepValue(field_detail.bind, data_item)

	const props_common: IPropsComponentCommon = {
		namespace,
		primary,
		field_detail,
		data_item,
		form_value
	}

	if (field_detail.edit?.type) {
		return <EditPopover {...props_common}></EditPopover>
	} else {
		return <ViewContent {...props_common}></ViewContent>
	}
}
