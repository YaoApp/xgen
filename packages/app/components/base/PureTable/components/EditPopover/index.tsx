import { Button, Form, Popover } from 'antd'
import clsx from 'clsx'

import { X } from '@/components'
import { CheckOutlined } from '@ant-design/icons'
import { hidePopover } from '@yaoapp/utils'

import ViewContent from '../ViewContent'
import getPlacement from './getPlacement'
import getWidth from './getWidth'
import styles from './index.less'

import type { IPropsComponentCommon } from '../../types'
import type { Component } from '@/types'

const Index = (props: IPropsComponentCommon) => {
	const { namespace, primary, field_detail, data_item, form_value } = props
	const edit_type = field_detail.edit.type

	const props_edit_component: Component.PropsEditComponent = {
		...field_detail.edit.props,
		__namespace: namespace,
		__primary: primary,
		__bind: field_detail.bind,
		__name: field_detail.name,
		__data_item: data_item,
		value: form_value,
		style: { width: getWidth(field_detail.edit.type) }
	}

	const onFinish = (v: any) => {
		window.$app.Event.emit(`${namespace}/save`, {
			[primary]: data_item[primary],
			...v
		})

		hidePopover()
	}

	const edit_content = (
		<Form
			className='flex justify_between'
			name={`form_table_td_${field_detail.bind}`}
			initialValues={{ [field_detail.bind]: form_value }}
			onFinish={onFinish}
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
				{...{ namespace, primary, field_detail, data_item, form_value }}
			></ViewContent>
		</div>
	)

	return (
		<Popover
			id='td_popover'
			overlayClassName={clsx([styles._local, styles[edit_type]])}
			placement={getPlacement(field_detail.edit.type)}
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
