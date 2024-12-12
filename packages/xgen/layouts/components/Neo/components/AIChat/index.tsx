import { Input, Button, Upload } from 'antd'
import clsx from 'clsx'
import { UploadSimple, Sparkle } from 'phosphor-react'
import { useState, useEffect, useRef, useLayoutEffect } from 'react'
import Icon from '@/widgets/Icon'
import styles from './index.less'
import { getLocale, useLocation } from '@umijs/max'
import Logo from '@/layouts/components/ColumnOne/Menu/Logo'
import useAIChat from '../../hooks/useAIChat'
import { App, Common } from '@/types'
import { useMemoizedFn } from 'ahooks'
import { useGlobal } from '@/context/app'
import ChatItem from '../ChatItem'

const { TextArea } = Input

interface ContextFile {
	name: string
	type: string
	url?: string
	thumbUrl?: string
}

interface AIChatProps {
	messages?: App.ChatInfo[]
	onSend?: (message: string, files?: any[]) => void
	className?: string
	title?: string
	onClose?: () => void
	onNew?: () => void
	currentPage?: string
	showCurrentPage?: boolean
	contextFiles?: ContextFile[]
	onRemoveContextFile?: (file: ContextFile) => void
	botAvatar?: string
}

const AIChat = (props: AIChatProps) => {
	const showCurrentPage = true

	const global = useGlobal()
	const locale = getLocale()
	const { pathname } = useLocation()
	const is_cn = locale === 'zh-CN'
	const stack = global.stack.paths.join('/')

	const { onSend, onClose, onNew, className, onRemoveContextFile, botAvatar } = props
	const [selectedFiles, setSelectedFiles] = useState<any[]>([])
	const [inputValue, setInputValue] = useState('')
	const messagesEndRef = useRef<HTMLDivElement>(null)
	const [chat_id, setChatId] = useState('hello')
	const [title, setTitle] = useState(global.app_info.optional?.neo?.name || 'AI Assistant')
	const [currentPage, setCurrentPage] = useState(pathname.replace(/\/_menu.*/gi, '').toLowerCase())
	const [contextFiles, setContextFiles] = useState<ContextFile[]>([])
	const { messages, loading, setMessages, cancel } = useAIChat({ chat_id })
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

	const handleFileSelect = (info: any) => {
		setSelectedFiles(info.fileList)
	}

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
										<div key={index} className={styles.fileItem}>
											<div className={styles.fileThumb}>
												{file.thumbUrl ? (
													<img
														src={file.thumbUrl}
														alt={file.name}
													/>
												) : (
													<div className={styles.fileTypeIcon}>
														{file.type}
													</div>
												)}
											</div>
											<div className={styles.fileName} title={file.name}>
												{file.name.length > 15
													? `${file.name.slice(0, 12)}...`
													: file.name}
											</div>
											{onRemoveContextFile && (
												<div
													className={styles.deleteBtn}
													onClick={(e) => {
														e.stopPropagation()
														onRemoveContextFile(file)
													}}
												>
													<Icon name='icon-x' size={12} />
												</div>
											)}
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
						disabled={loading}
					/>
					{loading ? (
						<Button
							type='text'
							icon={<Icon name='icon-x' size={16} />}
							className={styles.cancelBtn}
							onClick={cancel}
						>
							{is_cn ? '取消' : 'Cancel'}
						</Button>
					) : (
						inputValue && (
							<Button
								type='primary'
								icon={<Icon name='icon-send' size={16} />}
								className={styles.sendBtn}
								onClick={handleSend}
							>
								{is_cn ? '发送' : 'Send'}
							</Button>
						)
					)}
				</div>

				{/* Status Bar */}
				<div className={styles.statusBar}>
					<div className={styles.leftTools}>
						<Upload
							onChange={handleFileSelect}
							fileList={selectedFiles}
							multiple
							showUploadList={false}
							disabled={loading}
						>
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
