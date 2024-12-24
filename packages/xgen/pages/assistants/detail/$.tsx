import { useEffect, useState } from 'react'
import { useParams, history } from '@umijs/max'
import { Spin, Form, Input, Select, Radio, Button, Space, message, Avatar, Upload } from 'antd'
import { ArrowLeftOutlined, PlusOutlined, DeleteOutlined, SaveOutlined, CameraOutlined } from '@ant-design/icons'
import type { Assistant } from '@/layouts/components/Neo/components/AIChat/Card'
import type { UploadChangeParam } from 'antd/es/upload'
import Tag from '@/layouts/components/Neo/components/AIChat/Tag'
import styles from './index.less'

const { TextArea } = Input
const { Option } = Select

const AssistantDetail = () => {
	const params = useParams<{ '*': string }>()
	const id = params['*']
	const [loading, setLoading] = useState(true)
	const [form] = Form.useForm()
	const [avatarUrl, setAvatarUrl] = useState<string>('')

	// Use Form.useWatch to monitor form values
	const name = Form.useWatch('name', form)
	const type = Form.useWatch('type', form)
	const automated = Form.useWatch('automated', form)
	const readonly = Form.useWatch('readonly', form)

	useEffect(() => {
		const fetchAssistant = async () => {
			setLoading(true)
			try {
				// Mock data fetch - replace with actual API call
				await new Promise((resolve) => setTimeout(resolve, 1000))
				const data = {
					id: '1',
					assistant_id: id as string,
					type: 'coding',
					name: 'Code Companion',
					avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${id}`,
					description: 'Specialized in writing clean, efficient code with best practices.',
					connector: 'OpenAI GPT-4',
					readonly: false,
					automated: true,
					mentionable: true,
					created_at: new Date().toISOString(),
					option: {},
					prompts: [],
					flows: [],
					files: [],
					functions: [],
					permissions: []
				}
				form.setFieldsValue(data)
				setAvatarUrl(data.avatar)
			} catch (error) {
				message.error('Failed to load assistant data')
			}
			setLoading(false)
		}

		if (id) {
			fetchAssistant()
		}
	}, [id, form])

	const handleAvatarChange = async (info: UploadChangeParam) => {
		const { status, response } = info.file

		if (status === 'done') {
			// 这里使用模拟的响应，实际应该使用后端返回的URL
			const newAvatarUrl = response?.url || `https://api.dicebear.com/7.x/bottts/svg?seed=${Date.now()}`
			setAvatarUrl(newAvatarUrl)
			form.setFieldValue('avatar', newAvatarUrl)
			message.success('Avatar updated successfully')
		} else if (status === 'error') {
			message.error('Failed to update avatar')
		}
	}

	const handleBack = () => {
		history.push('/assistants')
	}

	const handleSubmit = async (values: Assistant) => {
		try {
			// Mock API call - replace with actual API call
			await new Promise((resolve) => setTimeout(resolve, 1000))
			message.success('Assistant updated successfully')
			history.push('/assistants')
		} catch (error) {
			message.error('Failed to update assistant')
		}
	}

	if (loading) {
		return (
			<div className={styles.loading}>
				<Spin size='large' />
			</div>
		)
	}

	return (
		<div className={styles.container}>
			<div className={styles.header}>
				<div className={styles.headerMain}>
					<Upload
						accept='image/*'
						showUploadList={false}
						onChange={handleAvatarChange}
						customRequest={({ onSuccess }) => {
							setTimeout(() => {
								onSuccess?.({
									url: `https://api.dicebear.com/7.x/bottts/svg?seed=${Date.now()}`
								})
							}, 500)
						}}
					>
						<div className={styles.avatarUpload}>
							<Avatar size={64} src={avatarUrl} />
							<div className={styles.avatarOverlay}>
								<CameraOutlined />
							</div>
						</div>
					</Upload>
					<div className={styles.headerInfo}>
						<h1 style={{ whiteSpace: 'nowrap' }}>{name}</h1>
						<div className={styles.tags}>
							{type && <Tag variant='primary'>{type}</Tag>}
							{automated && <Tag variant='success'>Automated</Tag>}
							{readonly && <Tag variant='warning'>Read-only</Tag>}
						</div>
					</div>
				</div>
				<div className={styles.headerActions}>
					<Space size='middle' direction='vertical'>
						<Button icon={<ArrowLeftOutlined />} onClick={handleBack}>
							Back
						</Button>
						<Button type='primary' icon={<SaveOutlined />} onClick={form.submit}>
							Save
						</Button>
					</Space>
				</div>
			</div>

			<div className={styles.content}>
				<Form
					form={form}
					layout='vertical'
					onFinish={handleSubmit}
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

					<div className={styles.section}>
						<h2>Prompts</h2>
						<p className={styles.sectionDesc}>
							Define the prompts that guide the assistant's behavior and responses.
						</p>
					</div>

					<Form.List name='prompts'>
						{(fields, { add, remove }) => (
							<>
								{fields.map(({ key, name, ...restField }) => (
									<div key={key} className={styles.promptItem}>
										<Form.Item
											{...restField}
											name={[name, 'role']}
											label='Role'
											rules={[
												{ required: true, message: 'Role is required' }
											]}
										>
											<Select placeholder='Select the role for this prompt'>
												<Option value='system'>System</Option>
												<Option value='user'>User</Option>
												<Option value='assistant'>Assistant</Option>
											</Select>
										</Form.Item>
										<Form.Item
											{...restField}
											name={[name, 'content']}
											label='Content'
											rules={[
												{
													required: true,
													message: 'Content is required'
												}
											]}
										>
											<TextArea
												autoSize={{ minRows: 4, maxRows: 8 }}
												placeholder='Enter the prompt content...'
											/>
										</Form.Item>
										<Button
											type='text'
											icon={<DeleteOutlined />}
											onClick={() => remove(name)}
											className={styles.removePrompt}
										/>
									</div>
								))}
								<Form.Item>
									<Button
										type='dashed'
										onClick={() => add()}
										icon={<PlusOutlined />}
										block
									>
										Add Prompt
									</Button>
								</Form.Item>
							</>
						)}
					</Form.List>

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

					<div className={styles.radioGroup}>
						<Form.Item name='automated' label='Automation' className={styles.radioItem}>
							<Radio.Group>
								<Radio value={true}>Enable</Radio>
								<Radio value={false}>Disable</Radio>
							</Radio.Group>
						</Form.Item>
						<Form.Item name='mentionable' label='Mentions' className={styles.radioItem}>
							<Radio.Group>
								<Radio value={true}>Allow</Radio>
								<Radio value={false}>Disallow</Radio>
							</Radio.Group>
						</Form.Item>
					</div>
				</Form>
			</div>
		</div>
	)
}

export default AssistantDetail
