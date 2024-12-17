import { Input, Button, Modal, message } from 'antd'
import { useState, useEffect, useRef } from 'react'
import Icon from '@/widgets/Icon'
import styles from './index.less'
import { getLocale } from '@umijs/max'
import { useMemoizedFn } from 'ahooks'
import { App } from '@/types'
import clsx from 'clsx'
import useAIChat from '../../../hooks/useAIChat'

interface ChatItem {
	chat_id: string
	title: string | null
}

interface ChatGroup {
	label: string
	chats: ChatItem[]
}

interface ChatResponse {
	groups: ChatGroup[]
	page: number
	pagesize: number
	total: number
	last_page: number
}

interface HistoryProps {
	visible: boolean
	onClose: () => void
	onSelect: (chatId: string) => void
	triggerRef: React.RefObject<HTMLElement>
}

const History = ({ visible, onClose, onSelect, triggerRef }: HistoryProps) => {
	const [chatGroups, setChatGroups] = useState<ChatGroup[]>([])
	const [loading, setLoading] = useState(false)
	const [keywords, setKeywords] = useState('')
	const [page, setPage] = useState(1)
	const [hasMore, setHasMore] = useState(true)
	const [editingChat, setEditingChat] = useState<{
		id: string
		title: string
		tempTitle: string
	} | null>(null)
	const historyRef = useRef<HTMLDivElement>(null)

	const locale = getLocale()
	const is_cn = locale === 'zh-CN'

	// Get methods from useAIChat hook
	const { getChats, deleteChat, updateChat, deleteAllChats } = useAIChat({})

	// Load chats
	const loadChats = useMemoizedFn(async (search?: string, pageNum: number = 1) => {
		setLoading(true)
		try {
			const response: ChatResponse = await getChats(
				search ? { keywords: search, page: pageNum } : { page: pageNum }
			)
			if (pageNum === 1) {
				setChatGroups(response.groups)
			} else {
				setChatGroups((prev) => [...prev, ...response.groups])
			}
			setHasMore(pageNum < response.last_page)
		} catch (error) {
			message.error(is_cn ? '加载历史会话失败' : 'Failed to load chat history')
			setChatGroups([])
		}
		setLoading(false)
	})

	// Add scroll load handler
	const handleScroll = useMemoizedFn((e: React.UIEvent<HTMLDivElement>) => {
		const { scrollTop, scrollHeight, clientHeight } = e.currentTarget
		if (scrollHeight - scrollTop - clientHeight < 50 && !loading && hasMore) {
			setPage((prev) => prev + 1)
			loadChats(keywords, page + 1)
		}
	})

	// Handle search
	const handleSearch = useMemoizedFn((value: string) => {
		setKeywords(value)
		setPage(1)
		loadChats(value, 1)
	})

	// Handle delete chat
	const handleDeleteChat = useMemoizedFn(async (chatId: string) => {
		try {
			await deleteChat(chatId)
			message.success(is_cn ? '删除成功' : 'Deleted successfully')
			loadChats(keywords)
		} catch (error) {
			message.error(is_cn ? '删除失败' : 'Failed to delete')
		}
	})

	// Handle update chat title
	const handleUpdateTitle = useMemoizedFn(async (chatId: string, title: string) => {
		try {
			await updateChat(chatId, title)
			message.success(is_cn ? '更新成功' : 'Updated successfully')
			setEditingChat(null)
			loadChats(keywords)
		} catch (error) {
			message.error(is_cn ? '更新失败' : 'Failed to update')
		}
	})

	// Handle delete all chats
	const handleDeleteAll = useMemoizedFn(() => {
		Modal.confirm({
			title: is_cn ? '确认删除' : 'Confirm Delete',
			content: is_cn ? '确定要删除所有会话吗？' : 'Are you sure you want to delete all chats?',
			okText: is_cn ? '确定' : 'OK',
			cancelText: is_cn ? '取消' : 'Cancel',
			onOk: async () => {
				try {
					await deleteAllChats()
					message.success(is_cn ? '清空成功' : 'Cleared successfully')
					loadChats()
				} catch (error) {
					message.error(is_cn ? '清空失败' : 'Failed to clear')
				}
			}
		})
	})

	useEffect(() => {
		if (visible) {
			loadChats()
		}
	}, [visible])

	useEffect(() => {
		if (visible && historyRef.current && triggerRef.current) {
			const triggerRect = triggerRef.current.getBoundingClientRect()
			const historyWidth = 300 // 与 CSS 中定义的宽度保持一致

			// 计算左侧位置，使窗口右侧与按钮右侧对齐
			const leftPosition = triggerRect.right - historyWidth

			historyRef.current.style.position = 'fixed'
			historyRef.current.style.top = `${triggerRect.bottom + 8}px` // 添加 8px 间距
			historyRef.current.style.left = `${leftPosition}px`
		}
	}, [visible])

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (
				historyRef.current &&
				!historyRef.current.contains(event.target as Node) &&
				triggerRef.current &&
				!triggerRef.current.contains(event.target as Node)
			) {
				onClose()
			}
		}

		if (visible) {
			document.addEventListener('mousedown', handleClickOutside)
		}

		return () => {
			document.removeEventListener('mousedown', handleClickOutside)
		}
	}, [visible, onClose])

	return (
		<div ref={historyRef} className={clsx(styles.history, { [styles.visible]: visible })}>
			<div className={styles.header}>
				<Input
					placeholder={is_cn ? '搜索会话' : 'Search chats'}
					onChange={(e) => handleSearch(e.target.value)}
					className={styles.search}
				/>
				<Button
					type='text'
					className={styles.clearBtn}
					onClick={handleDeleteAll}
					icon={<Icon name='material-delete' size={16} />}
				/>
				<Button
					type='text'
					className={styles.closeBtn}
					onClick={onClose}
					icon={<Icon name='material-close' size={16} />}
				/>
			</div>

			<div className={styles.list} onScroll={handleScroll}>
				{loading && page === 1 ? (
					<div className={styles.loading}>
						<Icon name='icon-loader' className={styles.spinner} />
						<span>{is_cn ? '加载中...' : 'Loading...'}</span>
					</div>
				) : chatGroups.length === 0 ? (
					<div className={styles.empty}>{is_cn ? '暂无会话' : 'No chats'}</div>
				) : (
					<>
						{chatGroups.map((group, index) => (
							<div key={index} className={styles.group}>
								<div className={styles.groupLabel}>{group.label}</div>
								{group.chats.map((chat) => (
									<div
										key={chat.chat_id}
										className={styles.chatItem}
										onClick={() => onSelect(chat.chat_id)}
										role='listitem'
										tabIndex={0}
										onKeyDown={(e) => {
											if (e.key === 'Enter') {
												onSelect(chat.chat_id)
											}
										}}
									>
										{editingChat?.id === chat.chat_id ? (
											<div className={styles.editWrapper}>
												<Input
													autoFocus
													defaultValue={editingChat.title}
													onChange={(e) =>
														setEditingChat({
															...editingChat,
															tempTitle: e.target.value
														})
													}
													onClick={(e) => e.stopPropagation()}
													aria-label={
														is_cn
															? '编辑会话标题'
															: 'Edit chat title'
													}
												/>
												<div className={styles.editActions}>
													<Button
														type='text'
														className={styles.actionBtn}
														onClick={(e) => {
															e.stopPropagation()
															handleUpdateTitle(
																chat.chat_id,
																editingChat.tempTitle
															)
														}}
														icon={
															<Icon
																name='material-check'
																size={14}
															/>
														}
													/>
													<Button
														type='text'
														className={styles.actionBtn}
														onClick={(e) => {
															e.stopPropagation()
															setEditingChat(null)
														}}
														icon={
															<Icon
																name='material-close'
																size={14}
															/>
														}
													/>
												</div>
											</div>
										) : (
											<>
												<span className={styles.titleText}>
													{chat.title ||
														(is_cn ? '未命名' : 'Untitled')}
												</span>
												<div className={styles.actions}>
													<Button
														type='text'
														className={styles.actionBtn}
														onClick={(e) => {
															e.stopPropagation()
															setEditingChat({
																id: chat.chat_id,
																title: chat.title || '',
																tempTitle:
																	chat.title || ''
															})
														}}
														icon={
															<Icon
																name='material-edit'
																size={14}
															/>
														}
														aria-label={is_cn ? '编辑' : 'Edit'}
													/>
													<Button
														type='text'
														className={styles.actionBtn}
														onClick={(e) => {
															e.stopPropagation()
															handleDeleteChat(chat.chat_id)
														}}
														icon={
															<Icon
																name='material-delete'
																size={14}
															/>
														}
														aria-label={
															is_cn ? '删除' : 'Delete'
														}
													/>
												</div>
											</>
										)}
									</div>
								))}
							</div>
						))}
						{loading && page > 1 && (
							<div className={styles.loadingMore}>
								<Icon name='icon-loader' className={styles.spinner} />
								<span>{is_cn ? '加载更多...' : 'Loading more...'}</span>
							</div>
						)}
					</>
				)}
			</div>
		</div>
	)
}

export default History
