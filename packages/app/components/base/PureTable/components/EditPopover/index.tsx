import { Button, Form, Popover } from 'antd'
import clsx from 'clsx'

import { X } from '@/components'
import { CheckOutlined } from '@ant-design/icons'

import ViewContent from '../ViewContent'
import styles from './index.less'

import type { IPropsEditPopover } from '../../types'
import type { IPropsEditComponent } from '@/types'

const Index = (props: IPropsEditPopover) => {
	const { namespace, field_detail, data_item, form_value, row_index } = props
      const edit_type = field_detail.edit.type

	const props_edit_component: IPropsEditComponent = {
		...field_detail.edit.props,
		__namespace: namespace,
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
			<ViewContent
				{...{ namespace, field_detail, data_item, form_value }}
			></ViewContent>
		</div>
	)

	return (
		<Popover
			id='td_popover'
			overlayClassName={clsx([styles._local, edit_type])}
			placement={edit_type === 'upload' ? 'bottom' : 'topLeft'}
			trigger='click'
			destroyTooltipOnHide={{ keepParent: false }}
			content={edit_content}
			align={{ offset: [-20, 0] }}
		>
			{view_content}
		</Popover>
	)
}

export default window.$app.memo(Index)
