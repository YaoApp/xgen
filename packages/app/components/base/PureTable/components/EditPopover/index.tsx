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

	const props_edit = {
		...field_detail.edit.props,
		__bind: field_detail.bind,
		__name: field_detail.name,
		__data_item: data_item,
		value: form_value,
		style: { width: 240 }
	}

	const Content = (
		<Form
			className='flex'
			name={`form_table_td_${field_detail.bind}_${row_index}`}
			initialValues={{ [field_detail.bind]: form_value }}
			onFinish={(v) => {}}
		>
			<X type='edit' name={field_detail.edit.type} props={props_edit}></X>
			<Button
				className='ml_12'
				type='primary'
				htmlType='submit'
				icon={<CheckOutlined></CheckOutlined>}
			></Button>
		</Form>
	)

	return (
		<Popover
			id='td_popover'
			overlayClassName={clsx(['td_popover', edit_type])}
			placement={edit_type === 'upload' ? 'bottom' : 'topLeft'}
			trigger='click'
			destroyTooltipOnHide={{ keepParent: false }}
			content={Content}
		>
			<div className='edit_text line_clamp_2'>
				{view_type ? (
					<X
						type='view'
						name={view_type}
						props={{
							__value: view_text,
							...field_detail.edit.props
						}}
					></X>
				) : (
					view_text || '-'
				)}
			</div>
		</Popover>
	)
}

export default window.$app.memo(Index)
