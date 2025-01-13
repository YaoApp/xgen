import React, { useEffect, useState } from 'react'
import { Spin } from 'antd'
import Icon from '@/widgets/Icon'
import styles from './index.less'
import { App } from '@/types'
import useAIChat from '../../../hooks/useAIChat'
import { getLocale } from '@umijs/max'
import clsx from 'clsx'

interface MentionListProps {
	keyword: string
	position: { top: number; left: number }
	onSelect: (mention: App.Mention) => void
	onClose: () => void
	containerRef?: React.RefObject<HTMLElement>
}

const MentionList: React.FC<MentionListProps> = ({ keyword, position, onSelect, onClose }) => {
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState<string | null>(null)
	const [mentions, setMentions] = useState<App.Mention[]>([])
	const [selectedIndex, setSelectedIndex] = useState(0)
	const { getMentions } = useAIChat({})
	const locale = getLocale()
	const is_cn = locale === 'zh-CN'

	// Load mentions when keyword changes
	useEffect(() => {
		const loadMentions = async () => {
			setLoading(true)
			setError(null)
			try {
				const data = await getMentions(keyword)
				setMentions(data)
			} catch (err) {
				setError(is_cn ? '加载失败' : 'Failed to load mentions')
			}
			setLoading(false)
		}

		loadMentions()
	}, [keyword])

	// Handle keyboard navigation
	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			if (e.key === 'ArrowDown') {
				e.preventDefault()
				setSelectedIndex((prev) => (prev + 1) % mentions.length)
			} else if (e.key === 'ArrowUp') {
				e.preventDefault()
				setSelectedIndex((prev) => (prev - 1 + mentions.length) % mentions.length)
			} else if (e.key === 'Enter' && mentions[selectedIndex]) {
				e.preventDefault()
				onSelect(mentions[selectedIndex])
			} else if (e.key === 'Escape') {
				e.preventDefault()
				onClose()
			}
		}

		document.addEventListener('keydown', handleKeyDown)
		return () => document.removeEventListener('keydown', handleKeyDown)
	}, [mentions, selectedIndex])

	// Handle item click
	const handleItemClick = (e: React.MouseEvent, mention: App.Mention, index: number) => {
		e.preventDefault()
		e.stopPropagation()
		setSelectedIndex(index)
		onSelect(mention)
	}

	// Handle list container click
	const handleListClick = (e: React.MouseEvent) => {
		e.stopPropagation()
	}

	// 计算列表位置
	const calculatePosition = () => {
		const ITEM_HEIGHT = 40 // 每个列表项高度
		const LIST_HEIGHT = Math.min(mentions.length * ITEM_HEIGHT + 24, 200) // 实际列表高度
		const LIST_WIDTH = 300 // max-width from CSS
		const PADDING = 12 // 边距

		// position 已经是相对于视窗的位置
		let { top, left } = position

		// 获取视窗尺寸
		const viewportHeight = window.innerHeight
		const viewportWidth = window.innerWidth

		// 检查底部空间
		const spaceBelow = viewportHeight - top
		const spaceAbove = top

		// 向上显示的条件
		if (spaceBelow < LIST_HEIGHT && spaceAbove > LIST_HEIGHT) {
			top = top - LIST_HEIGHT - PADDING
		}

		// 确保不超出右侧
		if (left + LIST_WIDTH > viewportWidth) {
			left = viewportWidth - LIST_WIDTH - PADDING
		}

		// 确保不超出左侧
		left = Math.max(PADDING, left)

		// 确保不超出底部
		if (top + LIST_HEIGHT > viewportHeight) {
			top = viewportHeight - LIST_HEIGHT - PADDING
		}

		// 确保不超出顶部
		top = Math.max(PADDING, top)

		return { top, left }
	}

	const adjustedPosition = calculatePosition()

	if (error) {
		return (
			<div className={styles.mentionList} style={{ top: position.top, left: position.left }}>
				<div className={styles.error}>
					<Icon name='icon-warning' size={14} />
					<span>{error}</span>
				</div>
			</div>
		)
	}

	return (
		<div
			className={styles.mentionList}
			style={{
				position: 'fixed',
				top: adjustedPosition.top,
				left: adjustedPosition.left,
				zIndex: 1000
			}}
			onMouseDown={(e) => e.preventDefault()}
			onClick={handleListClick}
		>
			{loading ? (
				<div className={styles.loading}>
					<Spin size='small' />
					<span>{is_cn ? '加载中...' : 'Loading...'}</span>
				</div>
			) : mentions.length === 0 ? (
				<div className={styles.empty}>{is_cn ? '没有找到相关用户' : 'No mentions found'}</div>
			) : (
				<div className={styles.list}>
					{mentions.map((mention, index) => (
						<div
							key={mention.id}
							className={clsx(styles.item, { [styles.selected]: index === selectedIndex })}
							onMouseDown={(e) => handleItemClick(e, mention, index)}
							onMouseEnter={() => setSelectedIndex(index)}
						>
							{mention.avatar && (
								<div className={styles.avatar}>
									<img src={mention.avatar} alt={mention.name} />
								</div>
							)}
							<div className={styles.info}>
								<div className={styles.name}>{mention.name}</div>
								{mention.type && <div className={styles.type}>{mention.type}</div>}
							</div>
						</div>
					))}
				</div>
			)}
		</div>
	)
}

export default MentionList
