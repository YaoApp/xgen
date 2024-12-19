import { useState, useRef, useEffect } from 'react'
import { Button, Tooltip, Input, message } from 'antd'
import type { InputRef } from 'antd'
import Icon from '@/widgets/Icon'
import styles from './index.less'
import { getLocale } from '@umijs/max'
import History from '../History'
import useAIChat from '../../../hooks/useAIChat'

interface HeaderProps {
	title: string
	loading?: boolean
	onNew?: () => void
	onClose?: () => void
	onHistory?: () => void
	onFloat?: () => void
	onSelect?: (chatId: string) => void
	buttons?: ('new' | 'history' | 'float' | 'close')[]
	chatId?: string
	titleGenerating?: boolean
}

const Header = ({
	title: initialTitle,
	titleGenerating = false,
	onNew,
	onClose,
	onHistory,
	onFloat,
	onSelect,
	buttons = ['new', 'history', 'float', 'close'],
	chatId
}: HeaderProps) => {
	const [showHistory, setShowHistory] = useState(false)
	const [isEditing, setIsEditing] = useState(false)
	const [editTitle, setEditTitle] = useState(initialTitle)
	const [displayTitle, setDisplayTitle] = useState(initialTitle)
	const [loading, setLoading] = useState(false)
	const triggerRef = useRef<HTMLButtonElement>(null)
	const inputRef = useRef<InputRef>(null)
	const { updateChat } = useAIChat({})

	const locale = getLocale()
	const is_cn = locale === 'zh-CN'

	useEffect(() => {
		setDisplayTitle(initialTitle)
		setEditTitle(initialTitle)
	}, [initialTitle])

	const buttonConfig = {
		new: {
			title: is_cn ? '新建对话' : 'New Chat',
			icon: 'material-add',
			size: 22,
			onClick: onNew
		},
		history: {
			title: is_cn ? '历史记录' : 'History',
			icon: 'material-history',
			size: 20,
			onClick: onHistory
		},
		float: {
			title: is_cn ? '弹出窗口' : 'Pop Out',
			icon: 'material-bubbles',
			size: 20,
			onClick: onFloat
		},
		close: {
			title: is_cn ? '关闭' : 'Close',
			icon: 'material-close',
			size: 20,
			onClick: onClose
		}
	}

	// Add history handlers
	const handleHistoryClick = () => {
		setShowHistory(true)
		onHistory?.()
	}

	const handleHistoryClose = () => {
		setShowHistory(false)
	}

	const handleHistorySelect = (chatId: string) => {
		onSelect?.(chatId)
		setShowHistory(false)
	}

	const handleTitleClick = (e: React.MouseEvent) => {
		e.stopPropagation()
		if (!chatId || titleGenerating) return
		setIsEditing(true)
		setEditTitle(displayTitle)
		inputRef.current?.focus()
	}

	const handleTitleUpdate = async () => {
		if (!chatId || loading) {
			return
		}
		if (editTitle.trim() === '') {
			message.error(is_cn ? '标题不能为空' : 'Title cannot be empty')
			return
		}
		setLoading(true)
		try {
			await updateChat(chatId, editTitle)
			setDisplayTitle(editTitle)
			setIsEditing(false)
		} catch (error) {
			message.error(is_cn ? '更新失败' : 'Failed to update')
		}
		setLoading(false)
	}

	const handleCancel = () => {
		setIsEditing(false)
		setEditTitle(displayTitle)
	}

	return (
		<div className={styles.header}>
			<div className={styles.titleWrapper}>
				{isEditing ? (
					<div className={styles.editWrapper}>
						<Input
							ref={inputRef}
							value={editTitle}
							onChange={(e) => setEditTitle(e.target.value)}
							onPressEnter={handleTitleUpdate}
							onKeyDown={(e) => {
								if (e.key === 'Escape') {
									handleCancel()
								}
							}}
							disabled={loading}
							autoFocus
						/>
						<div className={styles.editActions}>
							<Button
								type='text'
								className={styles.actionBtn}
								onClick={handleTitleUpdate}
								disabled={loading}
								icon={<Icon name='material-check' size={14} />}
							/>
							<Button
								type='text'
								className={styles.actionBtn}
								onClick={handleCancel}
								disabled={loading}
								icon={<Icon name='material-close' size={14} />}
							/>
						</div>
						{loading && <Icon name='icon-loader' className={styles.spinner} />}
					</div>
				) : (
					<div
						className={styles.title}
						onClick={handleTitleClick}
						style={{ cursor: titleGenerating ? 'not-allowed' : 'pointer' }}
					>
						<span>{displayTitle}</span>
						{titleGenerating ? (
							<Icon name='icon-loader' className={styles.spinner} />
						) : (
							<Icon name='material-edit' className={styles.editIcon} size={14} />
						)}
					</div>
				)}
			</div>
			<div className={styles.actions}>
				{buttons.map((key) => {
					const config = {
						...buttonConfig[key],
						onClick: key === 'history' ? handleHistoryClick : buttonConfig[key].onClick
					}
					return (
						<Tooltip key={key} title={config.title} placement='bottom'>
							<Button
								type='text'
								icon={<Icon name={config.icon} size={config.size} />}
								className={styles.actionBtn}
								onClick={config.onClick}
								ref={key === 'history' ? triggerRef : undefined}
							/>
						</Tooltip>
					)
				})}
			</div>

			<History
				visible={showHistory}
				onClose={handleHistoryClose}
				onSelect={handleHistorySelect}
				triggerRef={triggerRef}
			/>
		</div>
	)
}

export default Header
