import { Form, Row } from 'antd'
import root from 'react-shadow'

import { useGlobal } from '@/context/app'

import FormItem from '../FormItem'
import styles from './index.less'
import Styles from './styles'

import type { IPropsFields } from '../../types'

const { useForm } = Form

const Index = (props: IPropsFields) => {
	const { setting, showLabel, dataItem } = props
	const global = useGlobal()
	const [form] = useForm()

	return (
		<root.div className={styles._local}>
			<link rel='stylesheet' href={`/theme/${global.theme}.css`} />
			<Styles showLabel={showLabel}></Styles>
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
		</root.div>
	)
}

export default window.$app.memo(Index)
