import { useEffect, useState } from 'react'
import { useParams, history } from '@umijs/max'
import { Spin, Form, Button, Space, message, Avatar, Upload, Tabs } from 'antd'
import { ArrowLeftOutlined, SaveOutlined, CameraOutlined } from '@ant-design/icons'
import type { UploadChangeParam } from 'antd/es/upload'
import type { UploadFile } from 'antd/es/upload/interface'
import { App } from '@/types'
import useAIChat from '@/layouts/components/Neo/hooks/useAIChat'
import Tag from '@/layouts/components/Neo/components/AIChat/Tag'
import General from './components/General'
import Files from './components/Files'
import Workflow from './components/Workflow'
import Script from './components/Script'
import Functions from './components/Functions'
import Prompts from './components/Prompts'
import styles from './index.less'

interface Message {
	role: 'system' | 'user' | 'assistant' | 'developer'
	content: string
}

const AssistantDetail = () => {
	const params = useParams<{ '*': string }>()
	const id = params['*']
	const [loading, setLoading] = useState(true)
	const [form] = Form.useForm()
	const [avatarUrl, setAvatarUrl] = useState<string>('')
	const [files, setFiles] = useState<UploadFile[]>([])
	const [code, setCode] = useState<string>('')
	const [prompts, setPrompts] = useState<Message[]>([])
	const [options, setOptions] = useState<{ key: string; value: string }[]>([])
	const { findAssistant, saveAssistant } = useAIChat({})

	// Use Form.useWatch to monitor form values
	const name = Form.useWatch('name', form)
	const type = Form.useWatch('type', form)
	const automated = Form.useWatch('automated', form)
	const readonly = Form.useWatch('readonly', form)

	useEffect(() => {
		const fetchAssistant = async () => {
			setLoading(true)
			try {
				if (!id) {
					message.error('Invalid assistant ID')
					history.push('/assistants')
					return
				}

				const data = await findAssistant(id)
				if (!data) {
					message.error('Assistant not found')
					history.push('/assistants')
					return
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
			} catch (error) {
				message.error('Failed to load assistant data')
			}
			setLoading(false)
		}

		if (id) {
			fetchAssistant()
		}
	}, [id, form, findAssistant])

	const handleAvatarChange = async (info: UploadChangeParam) => {
		const { status, response } = info.file

		if (status === 'done') {
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

	const handleSubmit = async (values: App.Assistant) => {
		try {
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

			await saveAssistant(assistantData)
			message.success('Assistant updated successfully')
			history.push('/assistants')
		} catch (error) {
			message.error('Failed to update assistant')
		}
	}

	const handleSaveCode = () => {
		form.validateFields().then(async (values) => {
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
				await saveAssistant(assistantData)
				message.success('Code saved successfully')
			} catch (error) {
				message.error('Failed to save code')
			}
		})
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
			label: 'General',
			children: <General form={form} />
		},
		{
			key: 'prompts',
			label: 'Prompts',
			children: (
				<Prompts value={prompts} options={options} onChange={setPrompts} onOptionsChange={setOptions} />
			)
		},
		{
			key: 'files',
			label: 'Files',
			children: <Files files={files} onFilesChange={setFiles} />
		},
		{
			key: 'workflow',
			label: 'Workflow',
			children: <Workflow />
		},
		{
			key: 'functions',
			label: 'Functions',
			children: <Functions />
		},
		{
			key: 'script',
			label: 'Script',
			children: <Script code={code} onChange={setCode} onSave={handleSaveCode} />
		}
	]

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
				<Tabs items={items} defaultActiveKey='basic' className={styles.tabs} size='large' type='card' />
			</div>
		</div>
	)
}

export default AssistantDetail
