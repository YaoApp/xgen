import { useMemoizedFn } from 'ahooks'
import { Form } from 'antd'
import to from 'await-to-js'
import clsx from 'clsx'
import { useLayoutEffect } from 'react'

import Actions from './components/Actions'
import Sections from './components/Sections'
import { useOnValuesChange } from './hooks'
import styles from './index.less'

import type { IPropsPureForm, IPropsActions, IPropsSections } from './types'

const { useForm } = Form

const Index = (props: IPropsPureForm) => {
	const {
		namespace,
		primary,
		type,
		id,
		data,
		sections,
		actions,
		hooks,
		title,
		disabledActionsAffix,
		props: form_props,
		setData,
		setSetting,
		onSave
	} = props
	const [form] = useForm()
	const { getFieldsValue, setFieldsValue, resetFields, validateFields } = form
	const onValuesChange = useOnValuesChange(hooks?.onChange!, setFieldsValue, setData, setSetting)
	const { onLoadSync, reference } = form_props
	const disabled = type === 'view'

	const submit = useMemoizedFn(async () => {
		const [err] = await to(validateFields())

		if (err) return Promise.reject()

		return onSave(getFieldsValue(true))
	})

	useLayoutEffect(() => {
		if (id === 0) resetFields()
	}, [id])

	useLayoutEffect(() => {
		setFieldsValue(data)

		if (!Object.keys(data).length) return
		if (!onLoadSync) return

		Object.keys(data).map((key) => onValuesChange({ [key]: data[key] }))
	}, [data, onLoadSync])

	useLayoutEffect(() => {
		window.$app.Event.on(`${namespace}/submit`, submit)

		return () => window.$app.Event.off(`${namespace}/submit`, submit)
	}, [])

	const props_actions: IPropsActions = {
		namespace,
		primary,
		type,
		id,
		actions,
		data,
		disabledActionsAffix
	}

	const props_sections: IPropsSections = {
		namespace,
		primary,
		type,
		data,
		sections
	}

	return (
		<div className={clsx([styles._local, disabled && styles.disabled, 'w_100 border_box flex flex_column'])}>
			<div className='form_title_wrap w_100 border_box flex justify_between align_center relative'>
				<span className='title no_wrap'>{title}</span>
				<Actions {...props_actions}></Actions>
			</div>
			<div className='form_content_container w_100 relative'>
				<Form
					form={form}
					name={namespace}
					disabled={disabled}
					layout='vertical'
					onValuesChange={onValuesChange}
				>
					<div className='form_wrap w_100 border_box'>
						<Sections {...props_sections}></Sections>
					</div>
				</Form>
			</div>
		</div>
	)
}

export default window.$app.memo(Index)
