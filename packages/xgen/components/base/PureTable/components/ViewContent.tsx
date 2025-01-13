import { X } from '@/components'

import type { IPropsComponentCommon } from '../types'
import type { Component } from '@/types'

interface IProps extends Omit<IPropsComponentCommon, 'data_item'>, Component.BindValue {
	onSave: (v: any) => void
}

const Index = (props: IProps) => {
	const { namespace, primary, field_detail, form_bind, form_value, onSave } = props

	if (!field_detail.view?.type)
		return <div className='line_clamp_2'>Unknown view type: {field_detail.view?.type}</div>

	const props_view_component = {
		...field_detail.view.props,
		__namespace: namespace,
		__primary: primary,
		__bind: form_bind,
		__name: field_detail.name,
		__value: form_value,
		onSave
	}

	return <X type='view' name={field_detail.view.type} props={props_view_component}></X>
}

export default window.$app.memo(Index)
