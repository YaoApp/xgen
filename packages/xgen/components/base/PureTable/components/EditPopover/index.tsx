import { useMemoizedFn } from 'ahooks'
import { Button, Form, Popover } from 'antd'
import clsx from 'clsx'

import { X } from '@/components'
import { hidePopover } from '@/knife'
import { CheckOutlined } from '@ant-design/icons'

import ViewContent from '../ViewContent'
import getPlacement from './getPlacement'
import getWidth from './getWidth'
import styles from './index.less'

import type { IPropsComponentCommon } from '../../types'
import type { Component } from '@/types'

interface IProps extends IPropsComponentCommon {
	view_bind_value: Component.BindValue
	edit_bind_value: Component.BindValue
}

const Index = (props: IProps) => {
	const { namespace, primary, field_detail, data_item, view_bind_value, edit_bind_value, onSave } = props
	const edit_type = field_detail.edit.type
	const { form_bind, form_value } = edit_bind_value

	const props_edit_component: Component.PropsEditComponent = {
		...field_detail.edit.props,
		__namespace: namespace,
		__primary: primary,
		__bind: form_bind,
		__name: field_detail.name,
		__data_item: data_item,
		value: form_value,
		style: { width: getWidth(field_detail.edit.type) }
	}

	const onFinish = useMemoizedFn((v: any) => {
		onSave(v)

		hidePopover()
	})

	const edit_content = (
		<Form
			className='flex justify_between'
			name={`form_table_td_${form_bind}`}
			initialValues={{ [form_bind!]: form_value }}
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
		<div className={clsx(['line_clamp_2', field_detail?.view?.type, field_detail?.edit?.type && 'edit_text'])}>
			<ViewContent {...{ namespace, primary, field_detail, onSave, ...view_bind_value }}></ViewContent>
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
