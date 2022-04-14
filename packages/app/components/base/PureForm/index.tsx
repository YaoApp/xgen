import { Form } from 'antd'
import clsx from 'clsx'

import Actions from './components/Actions'
import Sections from './components/Sections'
import styles from './index.less'

import type { IPropsPureForm, IPropsActions, IPropsSections } from './types'

const { useForm } = Form

const Index = (props: IPropsPureForm) => {
	const { namespace, primary, data, sections, operation, title } = props
	const [form] = useForm()

	const props_actions: IPropsActions = {}

	const props_sections: IPropsSections = {
		namespace,
		primary,
		data,
		sections
	}

	return (
		<Form
			className={clsx([styles._local, 'w_100 border_box flex flex_column'])}
			form={form}
			name={namespace}
		>
			<div className='form_title_wrap w_100 border_box flex justify_between align_center'>
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
