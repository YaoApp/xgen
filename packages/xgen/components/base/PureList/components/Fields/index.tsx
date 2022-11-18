import { Form, Row } from 'antd'

import FormItem from '../FormItem'

import type { IPropsFields } from '../../types'

const { useForm } = Form

const Index = (props: IPropsFields) => {
	const { setting, showLabel, dataItem } = props
	const [form] = useForm()

	return (
		<div style={{ width: 'calc(100% - (38px * 4 + 12px * 5))' }}>
			<Form
				form={form}
				layout='vertical'
				onValuesChange={(_, values) => console.log(values)}
				initialValues={{ price: 123 }}
			>
				<Row gutter={12}>
					{setting.map((item) => (
						<FormItem showLabel={showLabel} item={item} key={item.name}></FormItem>
					))}
				</Row>
			</Form>
		</div>
	)
}

export default window.$app.memo(Index)
