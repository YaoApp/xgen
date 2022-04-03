import './index.less'

import { Button, Form, Popover } from 'antd'
import clsx from 'clsx'

import { X } from '@/components'
import { CheckOutlined } from '@ant-design/icons'
import { getDeepValue } from '@yaoapp/utils'

import { getText } from '../../utils'

import type { IPropsEditPopover } from '../../types'

const Index = (props: IPropsEditPopover) => {
	const { field_detail, data_item, row_index } = props
	const edit_type = field_detail.edit.type
	const view_type = field_detail.view?.type
	const form_value = getDeepValue(field_detail.bind, data_item)
	const view_text = getText(field_detail, data_item)

	const props_edit_component = {
		...field_detail.edit.props,
		__bind: field_detail.bind,
		__name: field_detail.name,
		__data_item: data_item,
		value: form_value,
		style: { width: 240 }
	}

	const edit_content = (
		<Form
			className='flex'
			name={`form_table_td_${field_detail.bind}_${row_index}`}
			initialValues={{ [field_detail.bind]: form_value }}
			onFinish={(v) => {}}
		>
			<X type='edit' name={field_detail.edit.type} props={props_edit_component}></X>
			<Button
				className='ml_12'
				type='primary'
				htmlType='submit'
				icon={<CheckOutlined></CheckOutlined>}
			></Button>
		</Form>
	)

	const view_content = (
		<div className='edit_text line_clamp_2'>
			{() => {
				if (!view_type) return view_text || '-'

				const props_view_component = {
					...field_detail.view.props,
					__bind: field_detail.bind,
					__name: field_detail.name,
					__data_item: data_item,
					value: form_value
				}

				return <X type='view' name={view_type} props={props_view_component}></X>
			}}
		</div>
	)

	return (
		<Popover
			id='td_popover'
			overlayClassName={clsx(['td_popover', edit_type])}
			placement={edit_type === 'upload' ? 'bottom' : 'topLeft'}
			trigger='click'
			destroyTooltipOnHide={{ keepParent: false }}
			content={edit_content}
		>
			{view_content}
		</Popover>
	)
}

export default window.$app.memo(Index)
