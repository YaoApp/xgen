import { useMemoizedFn } from 'ahooks'
import { useMemo } from 'react'

import { getDeepValue } from '@/knife'
import { getTemplateValue } from '@/utils'

import EditPopover from '../components/EditPopover'
import ViewContent from '../components/ViewContent'

import type { Common } from '@/types'
import type { IPropsComponentCommon } from '../types'

interface IProps {
	namespace: IPropsComponentCommon['namespace']
	primary: IPropsComponentCommon['primary']
	field_detail: Common.Column
	data_item: any
}

const Index = (props: IProps) => {
	const { namespace, primary, field_detail, data_item } = props

	const onSave = useMemoizedFn((v: any) => {
		window.$app.Event.emit(`${namespace}/save`, {
			[primary]: data_item[primary],
			...v
		})
	})

	const props_common: IPropsComponentCommon = {
		namespace,
		primary,
		field_detail: getTemplateValue(field_detail, data_item),
		data_item: data_item,
		onSave
	}

	const { view_bind_value, edit_bind_value } = useMemo(() => {
		const view_bind_value = field_detail?.view?.bind
			? {
					form_bind: field_detail.view.bind,
					form_value: getDeepValue(field_detail.view.bind, data_item)
			  }
			: {
					form_bind: field_detail.bind,
					form_value: getDeepValue(field_detail.bind, data_item)
			  }

		const edit_bind_value = field_detail?.edit?.bind
			? {
					form_bind: field_detail.edit.bind,
					form_value: getDeepValue(field_detail.edit.bind, data_item)
			  }
			: {
					form_bind: field_detail.bind,
					form_value: getDeepValue(field_detail.bind, data_item)
			  }

		return { view_bind_value, edit_bind_value }
	}, [field_detail, data_item])

	if (field_detail?.edit?.type) {
		return <EditPopover {...props_common} {...{ view_bind_value, edit_bind_value }}></EditPopover>
	} else {
		return <ViewContent {...props_common} {...view_bind_value}></ViewContent>
	}
}

export default window.$app.memo(Index)
