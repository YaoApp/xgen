import { Input, Button, Upload } from 'antd'
import clsx from 'clsx'
import { PaperPlaneTilt, X, UploadSimple, Sparkle, Robot, User, Plus } from 'phosphor-react'
import { useState, useEffect, useRef } from 'react'

import styles from './index.less'

const { TextArea } = Input

interface Message {
	role: 'user' | 'assistant'
	content: string
}

interface ContextFile {
	name: string
	type: string
	url?: string
	thumbUrl?: string
}

interface AIChatProps {
	messages?: Message[]
	onSend?: (message: string, files?: any[]) => void
	className?: string
	title?: string
	onClose?: () => void
	onNew?: () => void
	currentPage?: string
	showCurrentPage?: boolean
	contextFiles?: ContextFile[]
}

const AIChat = ({
	messages = [],
	onSend,
	className,
	title = 'AI Assistant',
	onClose,
	onNew,
	currentPage,
	showCurrentPage = true,
	contextFiles = []
}: AIChatProps) => {
	const [selectedFiles, setSelectedFiles] = useState<any[]>([])
	const [inputValue, setInputValue] = useState('')
	const messagesEndRef = useRef<HTMLDivElement>(null)

	const handleFileSelect = (info: any) => {
		setSelectedFiles(info.fileList)
	}

	const handleSend = () => {
		if (inputValue.trim()) {
			onSend?.(inputValue, selectedFiles)
			setInputValue('')
			setSelectedFiles([])
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

	return (
		<div className={clsx(styles.aiChat, className)}>
			{/* Header */}
			<div className={styles.header}>
				<div className={styles.title}>{title}</div>
				<div className={styles.actions}>
					<Button
						type='text'
						icon={<Plus size={20} />}
						className={styles.actionBtn}
						onClick={onNew}
					/>
					<Button
						type='text'
						icon={<X size={20} />}
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
								[styles.user]: msg.role === 'user',
								[styles.assistant]: msg.role === 'assistant'
							})}
						>
							<div className={styles.avatar}>
								{msg.role === 'user' ? (
									<User size={16} weight='fill' />
								) : (
									<Robot size={16} weight='fill' />
								)}
							</div>
							<div className={styles.content}>{msg.content}</div>
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
							<div className={styles.currentPage}>{currentPage}</div>
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
										</div>
									))}
								</div>
							</div>
						)}
					</div>
				)}

				<div className={styles.inputWrapper}>
					<TextArea
						autoSize={{ minRows: 4, maxRows: 16 }}
						placeholder='Type your message here...'
						className={styles.input}
						value={inputValue}
						onChange={handleInputChange}
						onKeyDown={(e) => {
							if (e.key === 'Enter') {
								if (e.shiftKey) {
									return
								}
								e.preventDefault()
								handleSend()
							}
						}}
					/>
					{inputValue && (
						<Button
							type='primary'
							icon={<PaperPlaneTilt size={16} />}
							className={styles.sendBtn}
							onClick={handleSend}
						/>
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
						>
							<Button type='text' icon={<UploadSimple size={14} />} />
						</Upload>
						<Button type='text' icon={<Sparkle size={14} />} />
					</div>
					<div className={styles.rightInfo}>Press Enter to send</div>
				</div>
			</div>
		</div>
	)
}

export default AIChat
