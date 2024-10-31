import { Form, Row } from 'antd'
import { debounce } from 'lodash-es'

import FormItem from '../FormItem'

import type { IPropsFields } from '../../types'

const { useForm } = Form

const Index = (props: IPropsFields) => {
	const { setting, showLabel, builder, hasChildren, dataItem, parentIds, __shadow_host_ref, onChange } = props
	const [form] = useForm()

	return (
		<div
			style={{
				width: builder
					? `calc(100% - (12px) * ${hasChildren ? 5 : 3})`
					: `calc(100% - (38px + 12px) * ${hasChildren ? 5 : 3})`
			}}
		>
			<Form
				form={form}
				layout='vertical'
				onValuesChange={debounce((_, values) => onChange(values, parentIds), 600)}
				initialValues={dataItem}
			>
				<Row gutter={12}>
					{setting.map((item) => (
						<FormItem
							__shadow_host_ref={__shadow_host_ref}
							showLabel={showLabel}
							item={item}
							key={item.name}
						></FormItem>
					))}
				</Row>
			</Form>
		</div>
	)
}

export default window.$app.memo(Index)
