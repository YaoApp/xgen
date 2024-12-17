import { Input, Button, Upload, message } from 'antd'
import { UploadChangeParam, UploadFile, UploadProps, RcFile } from 'antd/es/upload'
import clsx from 'clsx'
import { UploadSimple, Sparkle } from 'phosphor-react'
import { useState, useEffect, useRef, useLayoutEffect, ClipboardEvent } from 'react'
import Icon from '@/widgets/Icon'
import styles from './index.less'
import { getLocale, useLocation } from '@umijs/max'

import useAIChat from '../../hooks/useAIChat'
import { App, Common } from '@/types'
import { useMemoizedFn } from 'ahooks'
import { useGlobal } from '@/context/app'
import ChatItem from '../ChatItem'
import { isValidUrl } from '@/utils'
import DefaultHeader from './Header'

const { TextArea } = Input

interface AIChatProps {
	messages?: App.ChatInfo[]
	onSend?: (message: string, files?: any[]) => void
	className?: string
	title?: string
	onClose?: () => void
	onNew?: () => void
	onSelect?: () => void
	currentPage?: string
	showCurrentPage?: boolean
	botAvatar?: string
	header?: React.ReactNode
	headerButtons?: ('new' | 'history' | 'float' | 'close')[]
	upload_options?: {
		process_image?: boolean
		max_file_size?: number
		allowed_types?: string[]
	}
}

const AIChat = (props: AIChatProps) => {
	const showCurrentPage = true

	const global = useGlobal()
	const locale = getLocale()
	const { pathname } = useLocation()
	const is_cn = locale === 'zh-CN'
	const stack = global.stack.paths.join('/')

	const { onSend, onClose, onNew, className, botAvatar, header, headerButtons, upload_options } = props
	const [selectedFiles, setSelectedFiles] = useState<any[]>([])
	const [inputValue, setInputValue] = useState('')
	const messagesEndRef = useRef<HTMLDivElement>(null)
	const [chat_id, setChatId] = useState(global.neo.chat_id || 'hello')
	const [assistant_id, setAssistantId] = useState(global.neo.assistant_id)
	const [currentPage, setCurrentPage] = useState(pathname.replace(/\/_menu.*/gi, '').toLowerCase())
	const [initialized, setInitialized] = useState(false)

	const {
		messages,
		loading,
		title,
		setTitle,
		setMessages,
		cancel,
		uploadFile,
		attachments,
		removeAttachment,
		addAttachment,
		formatFileName,
		setAttachments,
		getChat
	} = useAIChat({ chat_id, upload_options })
	const [chat_context, setChatContext] = useState<App.ChatContext>({ placeholder: '', signal: '' })

	const [field, setField] = useState<App.Field>({
		name: '',
		bind: '',
		config: {} as Common.FieldDetail
	})

	const getContext = useMemoizedFn((v: App.Context) => setContext(v))
	const getField = useMemoizedFn((v: App.Field & { text: string; config: Common.FieldDetail }) => {
		if (loading) return

		setField(v)

		setMessages([
			...messages,
			{
				is_neo: false,
				text: v.text,
				context: {
					namespace: context.namespace,
					stack: stack || '',
					pathname,
					formdata: context.data_item,
					field: { name: v.name, bind: v.bind },
					config: v.config,
					signal: chat_context.signal,
					chat_id: chat_id,
					assistant_id: assistant_id
				}
			}
		])
	})

	const [context, setContext] = useState<App.Context>({
		namespace: '',
		primary: '',
		data_item: {}
	})

	// Load chat details when initialized
	useEffect(() => {
		const loadChat = async () => {
			if (!initialized && chat_id) {
				await getChat()
				setInitialized(true)
			}
		}
		loadChat()
	}, [initialized, chat_id])

	const handleSend = () => {
		const message = inputValue.trim()
		if (message) {
			// Clear input first
			setInputValue('')
			setSelectedFiles([])

			// Then send message
			onSend?.(message, selectedFiles)
			setMessages([
				...messages,
				{
					is_neo: false,
					text: message, // Use saved message instead of inputValue
					attachments: attachments, // Add attachments to the message
					context: {
						namespace: context.namespace,
						stack: stack || '',
						pathname,
						formdata: context.data_item,
						field: { name: field.name, bind: field.bind },
						config: field.config,
						signal: chat_context.signal,
						chat_id: chat_id,
						assistant_id: assistant_id
					}
				}
			])
		}
	}

	const scrollToBottom = () => {
		if (messagesEndRef.current) {
			const container = messagesEndRef.current.closest(`.${styles.messages}`)
			if (container) {
				container.scrollTop = container.scrollHeight
			}
		}
	}

	useEffect(() => {
		setTimeout(() => {
			scrollToBottom()
		}, 100)
	}, [messages])

	const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
		setInputValue(e.target.value)
		requestAnimationFrame(() => scrollToBottom())
	}

	/** Set Current Page **/
	useEffect(() => {
		setCurrentPage(pathname.replace(/\/_menu.*/gi, '').toLowerCase())
	}, [pathname])

	const handleNewChat = (options?: App.NewChatOptions) => {
		const new_chat_id = `chat_${Date.now()}`
		setChatId(new_chat_id)
		setMessages([])
		setAttachments([])

		// Update global chat_id
		global.setNeoChatId(new_chat_id)

		// Set untitled as title
		setTitle(is_cn ? '未命名' : 'Untitled')

		// Handle optional content
		if (options?.content) {
			setInputValue(options.content)
		}

		// Handle optional attachments
		if (options?.attachments?.length) {
			options.attachments.forEach((attachment) => {
				addAttachment(attachment)
			})
		}

		// Focus the input after creating new chat
		setTimeout(() => {
			inputRef.current?.focus()
		}, 0)

		onNew?.()
	}

	/** Register Events **/
	useLayoutEffect(() => {
		const events = window.$app.Event
		events.on('app/getContext', getContext)
		events.on('app/getField', getField)

		/** Create a new chat */
		events.on('app/neoNewChat', handleNewChat)

		return () => {
			events.off('app/getContext', getContext)
			events.off('app/getField', getField)
			events.off('app/neoNewChat', handleNewChat)
		}
	}, [])

	const handleOnNew = useMemoizedFn(() => {
		handleNewChat()
		onNew?.()
	})

	const inputRef = useRef<HTMLTextAreaElement>(null)

	useEffect(() => {
		if (!loading && inputRef.current) {
			inputRef.current.focus()
		}
	}, [loading])

	const uploadProps: UploadProps = {
		onChange: async (info: UploadChangeParam<UploadFile>) => {
			if (info.file.status === 'uploading') {
				return
			}
		},
		beforeUpload: async (file: RcFile) => {
			try {
				const attachment: App.ChatAttachment = {
					name: file.name,
					type: file.type.startsWith('image/')
						? 'IMG'
						: file.name.split('.').pop()?.toUpperCase() || 'FILE',
					status: 'uploading',
					blob: file
				}

				if (file.type.startsWith('image/')) {
					attachment.thumbUrl = URL.createObjectURL(file)
				}

				addAttachment(attachment)

				const result = await uploadFile(file)

				const updatedAttachment: App.ChatAttachment = {
					...attachment,
					status: 'done',
					url: result.url,
					thumbUrl: result.thumbUrl || attachment.thumbUrl,
					file_id: result.file_id,
					bytes: result.bytes,
					created_at: result.created_at,
					filename: result.filename,
					content_type: result.content_type
				}

				removeAttachment(attachment)
				addAttachment(updatedAttachment)

				message.success(`${formatFileName(file.name)} uploaded successfully`)
			} catch (error: any) {
				message.error(error.message || `Failed to upload ${file.name}`)
				removeAttachment({ name: file.name, type: file.type })
			}

			return false
		},
		multiple: true,
		showUploadList: false,
		disabled: loading
	}

	const handleFileClick = (attachment: App.ChatAttachment) => {
		if (attachment.type === 'URL') {
			window.open(attachment.url, '_blank')
			return
		}

		if (attachment.type === 'IMG' && attachment.thumbUrl) {
			window.open(attachment.thumbUrl, '_blank')
			return
		}

		if (attachment.blob) {
			const url = URL.createObjectURL(attachment.blob)
			window.open(url, '_blank')
			setTimeout(() => URL.revokeObjectURL(url), 100)
		}
	}

	const handlePaste = async (e: ClipboardEvent<HTMLTextAreaElement>) => {
		// 处理剪贴板中的文本
		const text = e.clipboardData?.getData('text')
		if (text && isValidUrl(text.trim()) && text.trim() === text) {
			e.preventDefault()
			// 如果是纯URL，添加为URL类型的Attachment
			const urlAttachment: App.ChatAttachment = {
				name: text,
				type: 'URL',
				status: 'done',
				url: text,
				thumbUrl: undefined
			}
			addAttachment(urlAttachment)
			return
		}

		// 处理剪贴板中的图片
		const items = e.clipboardData?.items
		if (!items) return

		for (const item of Array.from(items)) {
			if (item.type.startsWith('image/')) {
				e.preventDefault()
				const file = item.getAsFile()
				if (!file) continue

				// Convert File to RcFile
				const rcFile = new File([file], file.name, {
					type: file.type,
					lastModified: Date.now()
				}) as RcFile
				rcFile.uid = `rc-upload-${Date.now()}`

				try {
					const attachment: App.ChatAttachment = {
						name: `pasted-image-${Date.now()}.png`,
						type: 'IMG',
						status: 'uploading',
						blob: rcFile,
						thumbUrl: URL.createObjectURL(rcFile)
					}

					// 添加到attachments并显示加载状态
					addAttachment(attachment)

					// 上传文件
					const result = await uploadFile(rcFile)

					// 更新attachment状态
					const updatedAttachment: App.ChatAttachment = {
						...attachment,
						status: 'done',
						url: result.url,
						file_id: result.file_id,
						bytes: result.bytes,
						created_at: result.created_at,
						filename: result.filename,
						content_type: result.content_type
					}

					// 更新文件状态
					removeAttachment(attachment)
					addAttachment(updatedAttachment)

					message.success('Image uploaded successfully')
				} catch (error: any) {
					message.error(error.message || 'Failed to upload image')
					removeAttachment({ name: file.name, type: file.type })
				}
			}
		}
	}

	const handleHistorySelect = useMemoizedFn(async (chatId: string) => {
		// Update chat ID
		setChatId(chatId)
		global.setNeoChatId(chatId) // Update global chat ID

		// Reset messages and attachments
		setMessages([])
		setAttachments([])
		setInitialized(false) // Set initialized to false to trigger loading

		// Focus the input after switching chat
		setTimeout(() => {
			inputRef.current?.focus()
		}, 0)
	})

	const handleOnFloat = useMemoizedFn(() => {
		// Empty placeholder for now
	})

	return (
		<div className={clsx(styles.aiChat, className)}>
			{header || (
				<DefaultHeader
					title={title}
					onNew={handleOnNew}
					onClose={onClose}
					onHistory={() => {}}
					onFloat={handleOnFloat}
					onSelect={handleHistorySelect}
					buttons={headerButtons}
				/>
			)}

			{/* Chat Messages */}
			<div className={styles.messages}>
				<div className={styles.messageWrapper}>
					{!initialized ? (
						<div className={styles.loadingState}>
							<Icon
								name='icon-loader'
								size={14}
								color='var(--color_placeholder)'
								className={styles.spinner}
							/>
							<span>{is_cn ? '加载历史消息...' : 'Loading message history...'}</span>
						</div>
					) : (
						messages.map((msg, index) => (
							<ChatItem
								key={index}
								context={context}
								field={field}
								chat_info={msg}
								callback={() => {}}
								avatar={msg.is_neo ? botAvatar : undefined}
							/>
						))
					)}
					<div ref={messagesEndRef} />
				</div>
			</div>

			{/* Input Area */}
			<div className={styles.inputArea}>
				{((showCurrentPage && currentPage) || attachments.length > 0) && (
					<div className={styles.contextArea}>
						{showCurrentPage && currentPage && (
							<div className={styles.currentPage}>
								<div className={styles.pageInfo}>
									<Icon name='icon-link-2' size={12} className='pageIcon' />
									{currentPage}
								</div>
								{loading && (
									<div className={styles.loadingContainer}>
										<svg
											width='8'
											height='8'
											viewBox='0 0 8 8'
											fill='currentColor'
											xmlns='http://www.w3.org/2000/svg'
										>
											<circle cx='4' cy='4' r='4' />
										</svg>
									</div>
								)}
							</div>
						)}

						{attachments.length > 0 && (
							<div className={styles.attachmentsArea}>
								<div className={styles.attachmentsList}>
									{attachments.map((attachment, index) => (
										<div
											key={index}
											className={clsx(styles.attachmentItem, {
												[styles.uploading]:
													attachment.status === 'uploading'
											})}
											onClick={() => handleFileClick(attachment)}
											style={{ cursor: 'pointer' }}
										>
											<div className={styles.attachmentThumb}>
												{attachment.type === 'URL' ? (
													<div
														className={
															styles.attachmentTypeIcon
														}
													>
														<Icon name='icon-link' size={10} />
													</div>
												) : attachment.thumbUrl ? (
													<img
														src={attachment.thumbUrl}
														alt={attachment.name}
													/>
												) : (
													<div
														className={
															styles.attachmentTypeIcon
														}
													>
														{attachment.type}
													</div>
												)}
												{attachment.status === 'uploading' && (
													<div className={styles.uploadingOverlay}>
														<Icon
															name='icon-loader'
															size={16}
															className={styles.spinner}
														/>
													</div>
												)}
											</div>
											<div
												className={styles.attachmentName}
												title={attachment.name}
											>
												{attachment.name.length > 15
													? `${attachment.name.slice(0, 12)}...`
													: attachment.name}
											</div>
											<div
												className={styles.deleteBtn}
												onClick={(e) => {
													e.stopPropagation()
													removeAttachment(attachment)
												}}
											>
												<Icon name='icon-x' size={12} />
											</div>
										</div>
									))}
								</div>
							</div>
						)}
					</div>
				)}

				<div className={styles.inputWrapper}>
					<TextArea
						ref={inputRef}
						autoSize={{ minRows: 4, maxRows: 16 }}
						placeholder={loading ? 'Please wait for response...' : 'Type your message here...'}
						className={styles.input}
						value={inputValue}
						onChange={handleInputChange}
						onKeyDown={(e) => {
							if (e.key === 'Enter' && !loading) {
								if (e.shiftKey) {
									return
								}
								e.preventDefault()
								handleSend()
							}
						}}
						onPaste={handlePaste}
					/>
					<Button
						type='text'
						icon={
							loading ? (
								<Icon name='icon-square' size={16} />
							) : (
								<Icon name='icon-send' size={16} />
							)
						}
						className={styles.sendBtn}
						onClick={loading ? cancel : handleSend}
						disabled={!loading && !inputValue.trim()}
					/>
				</div>

				{/* Status Bar */}
				<div className={styles.statusBar}>
					<div className={styles.leftTools}>
						<Upload {...uploadProps}>
							<Button type='text' icon={<UploadSimple size={14} />} disabled={loading} />
						</Upload>
						<Button type='text' icon={<Sparkle size={14} />} disabled={loading} />
					</div>
					<div className={styles.rightInfo}>
						{loading
							? is_cn
								? '正在响应中...'
								: 'Waiting for response...'
							: is_cn
							? '换行：Shift + ⏎，发送：⏎'
							: 'Line break: Shift + ⏎, Send: ⏎'}
					</div>
				</div>
			</div>
		</div>
	)
}

export default AIChat
