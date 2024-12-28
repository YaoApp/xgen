import { useEffect, useState } from 'react'
import { useParams, history } from '@umijs/max'
import { Spin, Form, Button, Space, message, Avatar, Upload, Tabs } from 'antd'
import { ArrowLeftOutlined, SaveOutlined, CameraOutlined } from '@ant-design/icons'
import type { Assistant } from '@/layouts/components/Neo/components/AIChat/Card'
import type { UploadChangeParam } from 'antd/es/upload'
import type { UploadFile } from 'antd/es/upload/interface'
import Tag from '@/layouts/components/Neo/components/AIChat/Tag'
import General from './components/General'
import Files from './components/Files'
import Workflow from './components/Workflow'
import Script from './components/Script'
import Functions from './components/Functions'
import styles from './index.less'

const AssistantDetail = () => {
	const params = useParams<{ '*': string }>()
	const id = params['*']
	const [loading, setLoading] = useState(true)
	const [form] = Form.useForm()
	const [avatarUrl, setAvatarUrl] = useState<string>('')
	const [files, setFiles] = useState<UploadFile[]>([])
	const [code, setCode] = useState<string>('')

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
				setCode('// Your assistant code here\n')
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

	const handleSaveCode = () => {
		message.success('Code saved successfully')
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
			children: <Script code={code} onChange={setCode} />
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
