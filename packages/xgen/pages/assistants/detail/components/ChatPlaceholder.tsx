import { useState, useEffect } from 'react'
import { Input, Button, Space, Tag, Form } from 'antd'
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons'
import { getLocale } from '@umijs/max'
import styles from '../index.less'

const { TextArea } = Input

interface ChatPlaceholderData {
	title?: string
	description?: string
	prompts?: string[]
}

interface ChatPlaceholderProps {
	value?: ChatPlaceholderData
	onChange?: (data: ChatPlaceholderData) => void
	readonly?: boolean
}

export default function ChatPlaceholder({ value = {}, onChange, readonly = false }: ChatPlaceholderProps) {
	const [placeholderData, setPlaceholderData] = useState<ChatPlaceholderData>(value || {})
	const locale = getLocale()
	const is_cn = locale === 'zh-CN'
	const form = Form.useFormInstance()
	const assistantDescription = Form.useWatch('description', form)

	// Sync with form field value changes and set defaults
	useEffect(() => {
		// If we have a form context and the description is empty, use the assistant description
		let newValue = value || {}

		// Use assistant description as a default if no placeholder description exists
		if ((!newValue.description || newValue.description === '') && assistantDescription) {
			const greeting = is_cn
				? `你好，我是${form.getFieldValue('name') || ''}，${assistantDescription}`
				: `Hello, I'm ${form.getFieldValue('name') || ''}, ${assistantDescription}`

			newValue = {
				...newValue,
				title: newValue.title || (is_cn ? '新对话' : 'New Chat'),
				description: greeting
			}
		}

		setPlaceholderData(newValue)

		// If we added defaults, notify parent through onChange
		if (newValue !== value) {
			onChange?.(newValue)
		}
	}, [value, assistantDescription, form, is_cn, onChange])

	const handleTitleChange = (title: string) => {
		if (readonly) return
		const newData = { ...placeholderData, title }
		setPlaceholderData(newData)
		onChange?.(newData)
	}

	const handleDescriptionChange = (description: string) => {
		if (readonly) return
		const newData = { ...placeholderData, description }
		setPlaceholderData(newData)
		onChange?.(newData)
	}

	const handleAddPrompt = () => {
		if (readonly) return
		const prompts = [...(placeholderData?.prompts || []), '']
		const newData = { ...placeholderData, prompts }
		setPlaceholderData(newData)
		onChange?.(newData)
	}

	const handlePromptChange = (index: number, promptText: string) => {
		if (readonly) return
		const prompts = [...(placeholderData?.prompts || [])]
		prompts[index] = promptText
		const newData = { ...placeholderData, prompts }
		setPlaceholderData(newData)
		onChange?.(newData)
	}

	const handleRemovePrompt = (index: number) => {
		if (readonly) return
		const prompts = (placeholderData?.prompts || []).filter((_: string, i: number) => i !== index)
		const newData = { ...placeholderData, prompts }
		setPlaceholderData(newData)
		onChange?.(newData)
	}

	return (
		<div className={styles.chatPlaceholder}>
			<div className={styles.placeholderSection}>
				<div className={styles.placeholderField}>
					<label>{is_cn ? '标题' : 'Title'}</label>
					<Input
						placeholder={is_cn ? '输入聊天标题' : 'Enter chat title'}
						value={placeholderData?.title || ''}
						onChange={(e) => handleTitleChange(e.target.value)}
						disabled={readonly}
					/>
				</div>

				<div className={styles.placeholderField}>
					<label>{is_cn ? '描述' : 'Description'}</label>
					<TextArea
						placeholder={is_cn ? '输入聊天描述' : 'Enter chat description'}
						value={placeholderData?.description || ''}
						onChange={(e) => handleDescriptionChange(e.target.value)}
						autoSize={{ minRows: 2, maxRows: 4 }}
						disabled={readonly}
					/>
				</div>
			</div>

			<div className={styles.promptsSection}>
				<div className={styles.promptsHeader}>
					<h5>{is_cn ? '提示词列表' : 'Prompt List'}</h5>
					{!readonly && (
						<Button
							type='primary'
							icon={<PlusOutlined />}
							onClick={handleAddPrompt}
							className={styles.addButton}
						>
							{is_cn ? '添加提示词' : 'Add Prompt'}
						</Button>
					)}
				</div>

				<div className={styles.promptsList}>
					{(placeholderData?.prompts || []).map((prompt, index) => (
						<div key={index} className={styles.promptItem}>
							<Input
								value={prompt || ''}
								onChange={(e) => handlePromptChange(index, e.target.value)}
								placeholder={is_cn ? '输入提示词...' : 'Enter prompt...'}
								disabled={readonly}
							/>
							{!readonly && (
								<Button
									type='text'
									icon={<DeleteOutlined />}
									onClick={() => handleRemovePrompt(index)}
									className={styles.deleteBtn}
								/>
							)}
						</div>
					))}
				</div>
			</div>
		</div>
	)
}
