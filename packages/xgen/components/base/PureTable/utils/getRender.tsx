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
	const props_common: IPropsComponentCommon = {
		namespace,
		primary,
		field_detail: getTemplateValue(field_detail, data_item),
		data_item: data_item
	}

	if (field_detail.edit?.type) {
		return <EditPopover {...props_common}></EditPopover>
	} else {
		return <ViewContent {...props_common}></ViewContent>
	}
}
