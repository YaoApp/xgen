import { useState, useRef, useEffect } from 'react'
import { history, getLocale } from '@umijs/max'
import { Form, Button, Input, Select, Breadcrumb, message } from 'antd'
import { ArrowLeftOutlined, ArrowRightOutlined } from '@ant-design/icons'
import { App } from '@/types'
import useAIChat from '@/neo/hooks/useAIChat'
import Prompts from '../detail/components/Prompts'
import ChatPlaceholder from '../detail/components/ChatPlaceholder'
import styles from './index.less'
import { useGlobal } from '@/context/app'

const { TextArea } = Input
const { Option } = Select

interface Message {
	role: 'system' | 'user' | 'assistant' | 'developer'
	content: string
}

const AssistantCreate = () => {
	const locale = getLocale()
	const is_cn = locale === 'zh-CN'
	const [formTitle, setFormTitle] = useState(is_cn ? '新助手' : 'New Assistant')

	const global = useGlobal()
	const { connectors } = global

	const [form] = Form.useForm()
	const [prompts, setPrompts] = useState<Message[]>([])
	const [options, setOptions] = useState<{ key: string; value: string }[]>([])
	const [placeholder, setPlaceholder] = useState<App.ChatPlaceholder>({})
	const aiChatRef = useRef<any>(null)
	const { saveAssistant } = useAIChat({})
	const description = Form.useWatch('description', form)

	// Initialize aiChatRef immediately
	if (!aiChatRef.current) {
		aiChatRef.current = { saveAssistant }
	}

	// Keep aiChatRef updated with latest functions
	useEffect(() => {
		aiChatRef.current = { saveAssistant }
	}, [saveAssistant])

	// Update placeholder when description changes
	useEffect(() => {
		if (!description || placeholder?.description) return

		const assistantName = form.getFieldValue('name') || ''
		const greeting = is_cn
			? `你好，我是${assistantName}，${description}`
			: `Hello, I'm ${assistantName}, ${description}`

		setPlaceholder((prev) => ({
			...prev,
			title: prev.title || (is_cn ? '新对话' : 'New Chat'),
			description: greeting
		}))
	}, [description, is_cn, placeholder, form])

	const handleBack = () => {
		history.push('/assistants')
	}

	const handleSubmit = async (values: App.Assistant) => {
		try {
			// Generate a default avatar
			const avatarUrl = `https://api.dicebear.com/7.x/bottts/svg?seed=${Date.now()}`

			// Prepare the assistant data
			const assistantData = {
				...values,
				avatar: avatarUrl,
				type: 'assistant',
				mentionable: true,
				automated: true,
				built_in: false,
				readonly: false,
				prompts,
				placeholder
			}

			const result = await aiChatRef.current.saveAssistant(assistantData)

			if (result && result.assistant_id) {
				message.success(is_cn ? '助手创建成功' : 'Assistant created successfully')
				// Redirect to detail page
				history.push(`/assistants/detail/${result.assistant_id}`)
			} else {
				throw new Error('No assistant ID returned')
			}
		} catch (error) {
			console.error('Error creating assistant:', error)
			message.error(is_cn ? '创建助手失败' : 'Failed to create assistant')
		}
	}

	return (
		<div className={styles.container}>
			<div className={styles.breadcrumbContainer}>
				<Breadcrumb>
					<Breadcrumb.Item>
						<a
							href='/assistants'
							onClick={(e) => {
								e.preventDefault()
								handleBack()
							}}
						>
							{is_cn ? '助手列表' : 'Assistants'}
						</a>
					</Breadcrumb.Item>
					<Breadcrumb.Item>{is_cn ? '创建助手' : 'Create Assistant'}</Breadcrumb.Item>
				</Breadcrumb>
				<Button
					className={styles.backButton}
					icon={<ArrowLeftOutlined style={{ fontSize: '12px' }} />}
					type='text'
					onClick={handleBack}
					title={is_cn ? '返回' : 'Back'}
				>
					{is_cn ? '返回' : 'Back'}
				</Button>
			</div>

			<div className={styles.simpleFormContainer}>
				<div className={styles.formContent}>
					<div className={styles.formHeader}>
						<h2 className={styles.formTitle}>{formTitle}</h2>
						<Button type='primary' onClick={() => form.submit()} htmlType='submit'>
							{is_cn ? '创建' : 'Create'} <ArrowRightOutlined />
						</Button>
					</div>

					<Form
						form={form}
						onFinish={handleSubmit}
						layout='vertical'
						className={styles.form}
						requiredMark={false}
						prefixCls='xgen'
						labelCol={{ span: 24 }}
						wrapperCol={{ span: 24 }}
					>
						<Form.Item
							name='connector'
							label={is_cn ? 'AI 连接器' : 'AI Connector'}
							rules={[
								{
									required: true,
									message: is_cn ? '请选择AI连接器' : 'Please select AI connector'
								}
							]}
						>
							<Select
								placeholder={
									is_cn
										? '选择为此助手提供支持的AI连接器'
										: 'Select the AI connector to power this assistant'
								}
								showSearch
								filterOption={(input, option) =>
									(option?.children as unknown as string)
										.toLowerCase()
										.includes(input.toLowerCase())
								}
							>
								{Object.keys(connectors.mapping || {}).map((key) => (
									<Option key={key} value={key}>
										{connectors.mapping[key]}
									</Option>
								))}
							</Select>
						</Form.Item>

						<Form.Item
							name='name'
							label={is_cn ? '助手名称' : 'Assistant Name'}
							rules={[
								{
									required: true,
									message: is_cn ? '请输入助手名称' : 'Please input assistant name'
								}
							]}
						>
							<Input
								placeholder={is_cn ? '输入一个描述性名称' : 'Enter a descriptive name'}
								onChange={(e) => {
									const name = e.target.value.trim()
									setFormTitle(name || (is_cn ? '新助手' : 'New Assistant'))
								}}
							/>
						</Form.Item>

						<Form.Item
							name='description'
							label={is_cn ? '描述' : 'Description'}
							rules={[
								{
									required: true,
									message: is_cn ? '请输入描述' : 'Please input description'
								}
							]}
						>
							<TextArea
								autoSize={{ minRows: 4, maxRows: 6 }}
								placeholder={
									is_cn
										? '描述这个助手能做什么以及如何帮助用户...'
										: 'Describe what this assistant can do and how it can help users...'
								}
							/>
						</Form.Item>

						<div className={styles.promptsSection}>
							<h3>{is_cn ? '提示词' : 'Prompts'}</h3>
							<div className={styles.promptsContainer}>
								<Prompts
									value={prompts}
									options={options}
									onChange={setPrompts}
									onOptionsChange={setOptions}
								/>
							</div>
						</div>

						<div className={styles.placeholderSection}>
							<h3>{is_cn ? '对话占位符' : 'Chat Placeholder'}</h3>
							<div className={styles.placeholderContainer}>
								<ChatPlaceholder value={placeholder} onChange={setPlaceholder} />
							</div>
						</div>
					</Form>
				</div>
			</div>
		</div>
	)
}

export default AssistantCreate
