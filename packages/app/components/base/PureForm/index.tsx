import { Form } from 'antd'
import clsx from 'clsx'
import { useLayoutEffect } from 'react'

import { getLocale } from '@umijs/max'

import Actions from './components/Actions'
import Sections from './components/Sections'
import styles from './index.less'
import locales from './locales'

import type { IPropsPureForm, IPropsActions, IPropsSections } from './types'

const { useForm } = Form

const Index = (props: IPropsPureForm) => {
	const { namespace, primary, type, id, data, sections, operation, title, onSave, onBack } =
		props
	const [form] = useForm()
	const locale = getLocale()
	const { setFieldsValue, resetFields } = form
	const locale_messages = locales[locale]
	const disabled = type === 'view'

	useLayoutEffect(() => {
		if (id === 0) return resetFields()

		setFieldsValue(data)
	}, [id, data])

	const props_actions: IPropsActions = {
		locale_messages: locale_messages.actions,
		namespace,
		primary,
		type,
		id,
		operation,
		data,
		onBack
	}

	const props_sections: IPropsSections = {
		namespace,
		primary,
		data,
		sections,
		disabled
	}

	return (
		<Form
			className={clsx([
				styles._local,
				disabled && styles.disabled,
				'w_100 border_box flex flex_column'
			])}
			form={form}
			name={namespace}
			onFinish={onSave}
		>
			<div className='form_title_wrap w_100 border_box flex justify_between align_center relative'>
				<span className='title no_wrap'>{title}</span>
				<Actions {...props_actions}></Actions>
			</div>
			<div className='form_wrap w_100 border_box'>
				<Sections {...props_sections}></Sections>
			</div>
		</Form>
	)
}

export default window.$app.memo(Index)
