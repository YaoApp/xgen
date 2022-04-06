import { X } from '@/components'

import { getText } from '../utils'

import type { IPropsComponentCommon } from '../types'

const Index = (props: IPropsComponentCommon) => {
	const { namespace, primary, field_detail, data_item, form_value } = props
	const view_text = getText(field_detail, data_item)

	if (!field_detail.view?.type) return <div className='line_clamp_2'>{view_text || '-'}</div>

	const props_view_component = {
		...field_detail.view.props,
		__namespace: namespace,
		__primary: primary,
		__bind: field_detail.bind,
		__name: field_detail.name,
		__value: form_value,
		__data_item: data_item
	}

	return <X type='view' name={field_detail.view.type} props={props_view_component}></X>
}

export default window.$app.memo(Index)
