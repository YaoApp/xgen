import { Form, Radio, Input, Select } from 'antd'
import type { FormInstance } from 'antd'
import type { Assistant } from '@/layouts/components/Neo/components/AIChat/Card'
import styles from '../index.less'

const { TextArea } = Input
const { Option } = Select

interface GeneralProps {
	form: FormInstance
}

export default function General({ form }: GeneralProps) {
	return (
		<Form
			form={form}
			layout='vertical'
			className={styles.form}
			requiredMark={false}
			prefixCls='xgen'
			labelCol={{ span: 24 }}
			wrapperCol={{ span: 24 }}
		>
			<Form.Item
				name='name'
				label='Assistant Name'
				rules={[{ required: true, message: 'Please input assistant name' }]}
			>
				<Input placeholder='Enter a descriptive name' />
			</Form.Item>

			<Form.Item
				name='type'
				label='Assistant Type'
				rules={[{ required: true, message: 'Please select assistant type' }]}
			>
				<Select placeholder='What type of tasks will this assistant handle?'>
					<Option value='coding'>Coding Assistant</Option>
					<Option value='writing'>Writing Assistant</Option>
					<Option value='analysis'>Analysis Assistant</Option>
				</Select>
			</Form.Item>

			<Form.Item
				name='description'
				label='Description'
				rules={[{ required: true, message: 'Please input description' }]}
			>
				<TextArea
					autoSize={{ minRows: 4, maxRows: 6 }}
					placeholder='Describe what this assistant can do and how it can help users...'
				/>
			</Form.Item>

			<Form.Item
				name='connector'
				label='AI Connector'
				rules={[{ required: true, message: 'Please select AI connector' }]}
			>
				<Select placeholder='Select the AI connector to power this assistant'>
					<Option value='OpenAI GPT-4'>OpenAI GPT-4</Option>
					<Option value='Anthropic Claude'>Anthropic Claude</Option>
					<Option value='Google Gemini Pro'>Google Gemini Pro</Option>
				</Select>
			</Form.Item>

			<div className='radio-group-container'>
				<Form.Item label='Automation' name='automated' initialValue={true}>
					<Radio.Group>
						<Radio value={true}>Enable</Radio>
						<Radio value={false}>Disable</Radio>
					</Radio.Group>
				</Form.Item>

				<Form.Item label='Mentions' name='mentionable' initialValue={true}>
					<Radio.Group>
						<Radio value={true}>Allow</Radio>
						<Radio value={false}>Disallow</Radio>
					</Radio.Group>
				</Form.Item>
			</div>
		</Form>
	)
}
