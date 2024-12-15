import { Input, Button, Upload, message } from 'antd'
import { UploadChangeParam, UploadFile, UploadProps, RcFile } from 'antd/es/upload'
import clsx from 'clsx'
import { UploadSimple, Sparkle } from 'phosphor-react'
import { useState, useEffect, useRef, useLayoutEffect, ClipboardEvent } from 'react'
import Icon from '@/widgets/Icon'
import styles from './index.less'
import { getLocale, useLocation } from '@umijs/max'
import Logo from '@/layouts/components/ColumnOne/Menu/Logo'
import useAIChat, { ContextFile } from '../../hooks/useAIChat'
import { App, Common } from '@/types'
import { useMemoizedFn } from 'ahooks'
import { useGlobal } from '@/context/app'
import ChatItem from '../ChatItem'
import { isValidUrl } from '@/utils'

const { TextArea } = Input

interface AIChatProps {
	messages?: App.ChatInfo[]
	onSend?: (message: string, files?: any[]) => void
	className?: string
	title?: string
	onClose?: () => void
	onNew?: () => void
	currentPage?: string
	showCurrentPage?: boolean
	botAvatar?: string
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

	const { onSend, onClose, onNew, className, botAvatar, upload_options } = props
	const [selectedFiles, setSelectedFiles] = useState<any[]>([])
	const [inputValue, setInputValue] = useState('')
	const messagesEndRef = useRef<HTMLDivElement>(null)
	const [chat_id, setChatId] = useState('hello')
	const [title, setTitle] = useState(global.app_info.optional?.neo?.name || 'AI Assistant')
	const [currentPage, setCurrentPage] = useState(pathname.replace(/\/_menu.*/gi, '').toLowerCase())
	const {
		messages,
		loading,
		setMessages,
		cancel,
		uploadFile,
		contextFiles,
		removeContextFile,
		addContextFile,
		formatFileName
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
					signal: chat_context.signal
				}
			}
		])
	})

	const [context, setContext] = useState<App.Context>({
		namespace: '',
		primary: '',
		data_item: {}
	})

	const handleSend = () => {
		if (inputValue.trim()) {
			onSend?.(inputValue, selectedFiles)
			setInputValue('')
			setSelectedFiles([])

			// Send message to Neo
			setMessages([
				...messages,
				{
					is_neo: false,
					text: inputValue,
					context: {
						namespace: context.namespace,
						stack: stack || '',
						pathname,
						formdata: context.data_item,
						field: { name: field.name, bind: field.bind },
						config: field.config,
						signal: chat_context.signal
					}
				}
			])

			// Clear context files after sending
			contextFiles.forEach((file) => {
				if (file.thumbUrl) {
					URL.revokeObjectURL(file.thumbUrl)
				}
				removeContextFile(file)
			})
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

	/** Register Events **/
	useLayoutEffect(() => {
		const events = window.$app.Event
		events.on('app/getContext', getContext)
		events.on('app/getField', getField)

		return () => {
			events.off('app/getContext', getContext)
			events.off('app/getField', getField)
		}
	}, [])

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
				const contextFile: ContextFile = {
					name: file.name,
					type: file.type.startsWith('image/')
						? 'IMG'
						: file.name.split('.').pop()?.toUpperCase() || 'FILE',
					status: 'uploading',
					blob: file
				}

				// If it's an image, create a preview
				if (file.type.startsWith('image/')) {
					contextFile.thumbUrl = URL.createObjectURL(file)
				}

				// Add to context files with loading state
				addContextFile(contextFile)

				// Upload the file
				const result = await uploadFile(file)

				// Update context file with success state and result
				const updatedFile: ContextFile = {
					...contextFile,
					status: 'done',
					url: result.url,
					thumbUrl: result.thumbUrl || contextFile.thumbUrl,
					file_id: result.file_id,
					bytes: result.bytes,
					created_at: result.created_at,
					filename: result.filename,
					content_type: result.content_type
				}

				// Remove old file and add updated one
				removeContextFile(contextFile)
				addContextFile(updatedFile)

				message.success(`${formatFileName(file.name)} uploaded successfully`)
			} catch (error: any) {
				message.error(error.message || `Failed to upload ${file.name}`)

				// Remove failed file from context
				removeContextFile({ name: file.name, type: file.type })
			}

			return false // Prevent default upload behavior
		},
		multiple: true,
		showUploadList: false,
		disabled: loading
	}

	// Update click handler function
	const handleFileClick = (file: ContextFile) => {
		if (file.type === 'URL') {
			window.open(file.url, '_blank')
			return
		}

		// For images, use thumbUrl (local preview)
		if (file.type === 'IMG' && file.thumbUrl) {
			window.open(file.thumbUrl, '_blank')
			return
		}

		// For other files, create and open object URL
		if (file.blob) {
			const url = URL.createObjectURL(file.blob)
			window.open(url, '_blank')
			// Clean up object URL after window opens
			setTimeout(() => URL.revokeObjectURL(url), 100)
		}
	}

	const handlePaste = async (e: ClipboardEvent<HTMLTextAreaElement>) => {
		// 处理剪贴板中的文本
		const text = e.clipboardData?.getData('text')
		if (text && isValidUrl(text.trim()) && text.trim() === text) {
			e.preventDefault()
			// 如果是纯URL，添加为URL类型的ContextFile
			const urlFile: ContextFile = {
				name: text,
				type: 'URL',
				status: 'done',
				url: text,
				thumbUrl: undefined
			}
			addContextFile(urlFile)
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
					const contextFile: ContextFile = {
						name: `pasted-image-${Date.now()}.png`,
						type: 'IMG',
						status: 'uploading',
						blob: rcFile,
						thumbUrl: URL.createObjectURL(rcFile)
					}

					// 添加到context files并显示加载状态
					addContextFile(contextFile)

					// 上传文件
					const result = await uploadFile(rcFile)

					// 更新context file状态
					const updatedFile: ContextFile = {
						...contextFile,
						status: 'done',
						url: result.url,
						file_id: result.file_id,
						bytes: result.bytes,
						created_at: result.created_at,
						filename: result.filename,
						content_type: result.content_type
					}

					// 更新文件状态
					removeContextFile(contextFile)
					addContextFile(updatedFile)

					message.success('Image uploaded successfully')
				} catch (error: any) {
					message.error(error.message || 'Failed to upload image')
					removeContextFile({ name: file.name, type: file.type })
				}
			}
		}
	}

	return (
		<div className={clsx(styles.aiChat, className)}>
			{/* Header */}
			<div className={styles.header}>
				<div className={styles.title}>{title}</div>
				<div className={styles.actions}>
					<Button
						type='text'
						icon={<Icon name='icon-plus' size={20} />}
						className={styles.actionBtn}
						onClick={onNew}
					/>
					<Button
						type='text'
						icon={<Icon name='icon-x' size={20} />}
						className={styles.actionBtn}
						onClick={onClose}
					/>
				</div>
			</div>

			{/* Chat Messages */}
			<div className={styles.messages}>
				<div className={styles.messageWrapper}>
					{messages.map((msg, index) => (
						<div
							key={index}
							className={clsx(styles.messageItem, {
								[styles.user]: !msg.is_neo,
								[styles.assistant]: msg.is_neo
							})}
						>
							<div className={styles.avatar}>
								{msg.is_neo &&
									(botAvatar ? (
										<img src={botAvatar} alt='bot' />
									) : (
										<Logo logo={undefined} />
									))}
							</div>
							<div className={styles.content}>
								<ChatItem
									context={context}
									field={field}
									chat_info={msg}
									callback={() => {}}
									key={index}
								></ChatItem>
							</div>
						</div>
					))}
					<div ref={messagesEndRef} />
				</div>
			</div>

			{/* Input Area */}
			<div className={styles.inputArea}>
				{((showCurrentPage && currentPage) || contextFiles.length > 0) && (
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

						{contextFiles.length > 0 && (
							<div className={styles.filesContext}>
								<div className={styles.filesList}>
									{contextFiles.map((file, index) => (
										<div
											key={index}
											className={clsx(styles.fileItem, {
												[styles.uploading]: file.status === 'uploading'
											})}
											onClick={() => handleFileClick(file)}
											style={{ cursor: 'pointer' }}
										>
											<div className={styles.fileThumb}>
												{file.type === 'URL' ? (
													<div className={styles.fileTypeIcon}>
														<Icon name='icon-link' size={16} />
													</div>
												) : file.thumbUrl ? (
													<img
														src={file.thumbUrl}
														alt={file.name}
													/>
												) : (
													<div className={styles.fileTypeIcon}>
														{file.type}
													</div>
												)}
												{file.status === 'uploading' && (
													<div className={styles.uploadingOverlay}>
														<Icon
															name='icon-loader'
															size={16}
															className={styles.spinner}
														/>
													</div>
												)}
											</div>
											<div className={styles.fileName} title={file.name}>
												{file.name.length > 15
													? `${file.name.slice(0, 12)}...`
													: file.name}
											</div>
											<div
												className={styles.deleteBtn}
												onClick={(e) => {
													e.stopPropagation()
													removeContextFile(file)
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
