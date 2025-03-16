import { useEffect, useState, useRef } from 'react'
import { useParams, history, getLocale } from '@umijs/max'
import { Spin, Form, Button, Space, message, Avatar, Upload, Tabs, Tooltip, Breadcrumb } from 'antd'
import { ArrowLeftOutlined, SaveOutlined, CameraOutlined, MessageOutlined } from '@ant-design/icons'
import type { UploadChangeParam } from 'antd/es/upload'
import type { UploadFile } from 'antd/es/upload/interface'
import { App } from '@/types'
import useAIChat from '@/layouts/components/Neo/hooks/useAIChat'
import Tag from '@/layouts/components/Neo/components/AIChat/Tag'
import Icon from '@/widgets/Icon'
import General from './components/General'
import Files from './components/Files'
// import Workflow from './components/Workflow'
// import Script from './components/Script'
import Tools from './components/Tools'
import Prompts from './components/Prompts'
import styles from './index.less'
import { useGlobal } from '@/context/app'

interface Message {
	role: 'system' | 'user' | 'assistant' | 'developer'
	content: string
}

const AssistantDetail = () => {
	const params = useParams<{ '*': string }>()
	const id = params['*'] || ''
	const locale = getLocale()
	const is_cn = locale === 'zh-CN'

	const global = useGlobal()
	const { default_assistant, connectors } = global

	const [loading, setLoading] = useState(true)
	const [form] = Form.useForm()
	const [avatarUrl, setAvatarUrl] = useState<string>('')
	const [files, setFiles] = useState<UploadFile[]>([])
	const [code, setCode] = useState<string>('')
	const [prompts, setPrompts] = useState<Message[]>([])
	const [options, setOptions] = useState<{ key: string; value: string }[]>([])
	const aiChatRef = useRef<any>(null)
	const { findAssistant, saveAssistant } = useAIChat({})
	const fetchedRef = useRef(false)
	const previousIdRef = useRef<string>('')

	// Initialize aiChatRef immediately
	if (!aiChatRef.current) {
		aiChatRef.current = { findAssistant, saveAssistant }
	}

	// Keep aiChatRef updated with latest functions
	useEffect(() => {
		aiChatRef.current = { findAssistant, saveAssistant }
	}, [findAssistant, saveAssistant])

	// Use Form.useWatch to monitor form values
	const name = Form.useWatch('name', form)
	const automated = Form.useWatch('automated', form)
	const readonly = Form.useWatch('readonly', form)
	const built_in = Form.useWatch('built_in', form)
	const mentionable = Form.useWatch('mentionable', form)
	const connector = Form.useWatch('connector', form)
	const tags = Form.useWatch('tags', form)
	const description = Form.useWatch('description', form)

	useEffect(() => {
		// If the ID hasn't changed, don't refetch
		if (previousIdRef.current === id && fetchedRef.current) {
			return
		}

		// Update the previous ID ref
		previousIdRef.current = id

		const fetchAssistant = async () => {
			setLoading(true)

			try {
				if (!id) {
					message.error(is_cn ? '无效的助手ID' : 'Invalid assistant ID')
					history.push('/assistants')
					return
				}

				const data = await aiChatRef.current.findAssistant(id)

				if (!data) {
					message.error(is_cn ? '未找到助手' : 'Assistant not found')
					history.push('/assistants')
					return
				}

				// 如果数据中有 type 但没有 tags，将 type 转换为 tags
				if (data.type && (!data.tags || data.tags.length === 0)) {
					data.tags = [data.type]
				}

				// Ensure built_in and readonly are properly processed as boolean values
				if (data.built_in !== undefined) {
					data.built_in = Boolean(data.built_in)
				}

				if (data.readonly !== undefined) {
					data.readonly = Boolean(data.readonly)
				}

				form.setFieldsValue(data)
				setAvatarUrl(data.avatar || '')
				setCode(data.option?.code || '// Your assistant code here\n')
				setPrompts(data.prompts || [])
				setOptions(
					Object.entries(data.option || {}).map(([key, value]) => ({
						key,
						value: String(value)
					}))
				)
				fetchedRef.current = true
			} catch (error) {
				message.error(is_cn ? '加载助手数据失败' : 'Failed to load assistant data')
			}

			setLoading(false)
		}

		if (id && aiChatRef.current) {
			fetchAssistant()
		}
	}, [id, is_cn]) // Add is_cn to dependencies

	const handleAvatarChange = async (info: UploadChangeParam) => {
		if (readonly) return // 如果是只读模式，不允许修改

		const { status, response } = info.file

		if (status === 'done') {
			const newAvatarUrl = response?.url || `https://api.dicebear.com/7.x/bottts/svg?seed=${Date.now()}`
			setAvatarUrl(newAvatarUrl)
			form.setFieldValue('avatar', newAvatarUrl)
			message.success(is_cn ? '头像更新成功' : 'Avatar updated successfully')
		} else if (status === 'error') {
			message.error(is_cn ? '头像更新失败' : 'Failed to update avatar')
		}
	}

	const handleBack = () => {
		// Reset refs before redirecting
		fetchedRef.current = false
		previousIdRef.current = ''
		history.push('/assistants')
	}

	const handleSubmit = async (values: App.Assistant) => {
		if (readonly) return // 如果是只读模式，不允许修改

		try {
			// Ensure built_in and readonly are properly processed as boolean values
			if (values.built_in !== undefined) {
				values.built_in = Boolean(values.built_in)
			}

			if (values.readonly !== undefined) {
				values.readonly = Boolean(values.readonly)
			}

			// Prepare the assistant data
			const assistantData = {
				...values,
				assistant_id: id,
				option: {
					...Object.fromEntries(options.map(({ key, value }) => [key, value])),
					code
				},
				prompts
			}

			await aiChatRef.current.saveAssistant(assistantData)
			message.success(is_cn ? '助手更新成功' : 'Assistant updated successfully')

			// Reset refs before redirecting
			fetchedRef.current = false
			previousIdRef.current = ''
			history.push('/assistants')
		} catch (error) {
			message.error(is_cn ? '更新助手失败' : 'Failed to update assistant')
		}
	}

	const handleSaveCode = () => {
		if (readonly) return // 如果是只读模式，不允许修改

		form.validateFields()
			.then(async (values) => {
				try {
					const assistantData = {
						...values,
						assistant_id: id,
						option: {
							...Object.fromEntries(options.map(({ key, value }) => [key, value])),
							code
						},
						prompts
					}

					await aiChatRef.current.saveAssistant(assistantData)
					message.success(is_cn ? '代码保存成功' : 'Code saved successfully')
				} catch (error) {
					message.error(is_cn ? '保存代码失败' : 'Failed to save code')
				}
			})
			.catch(() => {
				// Form validation failed
			})
	}

	// Handle chat button click without triggering the card click
	const handleChatClick = (e: React.MouseEvent) => {
		e.stopPropagation()

		// Get current form values
		const formValues = form.getFieldsValue()
		const options: App.NewChatOptions = {
			assistant: {
				assistant_id: id,
				assistant_name: formValues.name,
				assistant_avatar: avatarUrl,
				assistant_deleteable: id !== default_assistant.assistant_id
			},
			placeholder: formValues.placeholder || undefined
		}

		// Trigger the new chat event
		window.$app.Event.emit('app/neoNewChat', options)
	}

	if (loading) {
		return (
			<div className={styles.loading}>
				<Spin size='large' />
			</div>
		)
	}

	const items = [
		{
			key: 'general',
			label: is_cn ? '基本信息' : 'General',
			children: <General form={form} />
		},
		{
			key: 'prompts',
			label: is_cn ? '提示词' : 'Prompts',
			children: (
				<Prompts value={prompts} options={options} onChange={setPrompts} onOptionsChange={setOptions} />
			)
		},
		{
			key: 'files',
			label: is_cn ? '文件' : 'Files',
			children: <Files files={files} onFilesChange={setFiles} />
		},
		/* 暂时注释掉 Workflow
		{
			key: 'workflow',
			label: is_cn ? '工作流' : 'Workflow',
			children: <Workflow />
		},
		*/
		{
			key: 'tools',
			label: is_cn ? '工具' : 'Tools',
			children: <Tools />
		}
		/* 暂时注释掉 Script
		{
			key: 'script',
			label: is_cn ? '脚本' : 'Script',
			children: <Script code={code} onChange={setCode} onSave={handleSaveCode} />
		}
		*/
	]

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
					<Breadcrumb.Item>{name || (is_cn ? '助手详情' : 'Assistant Detail')}</Breadcrumb.Item>
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
			<div className={styles.header}>
				<div className={styles.headerContent}>
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
							disabled={readonly}
						>
							<div className={styles.avatarUpload}>
								<Avatar size={64} src={avatarUrl} />
								{!readonly && (
									<div className={styles.avatarOverlay}>
										<CameraOutlined />
									</div>
								)}
							</div>
						</Upload>
						<div className={styles.headerInfo}>
							<h1 style={{ whiteSpace: 'nowrap' }}>{name}</h1>
							<div className={styles.tags}>
								{tags &&
									tags.length > 0 &&
									tags.map((tag: string, index: number) => (
										<Tag key={index} variant='auto'>
											{tag}
										</Tag>
									))}
							</div>
							<div className={styles.description}>{description}</div>
						</div>
						<div className={styles.headerMeta}>
							{connector && (
								<div className={styles.connector}>{connectors.mapping[connector]}</div>
							)}
							<div className={styles.statusIcons}>
								{built_in && (
									<Tooltip title={is_cn ? '系统内建' : 'Built-in'}>
										<span className={styles.statusIcon}>
											<Icon name='icon-package' size={16} color='#b37feb' />
										</span>
									</Tooltip>
								)}
								{!built_in && readonly && (
									<Tooltip title={is_cn ? '只读' : 'Readonly'}>
										<span className={styles.statusIcon}>
											<Icon name='icon-lock' size={16} color='#faad14' />
										</span>
									</Tooltip>
								)}
								{mentionable && (
									<Tooltip title={is_cn ? '可提及' : 'Mentionable'}>
										<span className={styles.statusIcon}>
											<Icon name='icon-at-sign' size={16} color='#52c41a' />
										</span>
									</Tooltip>
								)}
								{automated && (
									<Tooltip title={is_cn ? '自动化' : 'Automated'}>
										<span className={styles.statusIcon}>
											<Icon name='icon-cpu' size={16} color='#1890ff' />
										</span>
									</Tooltip>
								)}
							</div>
						</div>
					</div>
				</div>
				<div className={styles.headerActions}>
					<div className={styles.leftButton}>
						<Button
							type='primary'
							icon={<Icon name='icon-message-circle' size={14} />}
							onClick={handleChatClick}
						>
							{is_cn ? '聊天' : 'Chat'}
						</Button>
					</div>
					{!readonly && (
						<div className={styles.rightButton}>
							<Button
								type='primary'
								icon={<SaveOutlined style={{ fontSize: '14px' }} />}
								onClick={form.submit}
							>
								{is_cn ? '保存' : 'Save'}
							</Button>
						</div>
					)}
				</div>
			</div>

			<div className={styles.content}>
				<Tabs items={items} defaultActiveKey='basic' className={styles.tabs} size='large' type='card' />
			</div>
		</div>
	)
}

export default AssistantDetail
