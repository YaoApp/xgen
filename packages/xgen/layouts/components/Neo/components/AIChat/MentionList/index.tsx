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
}

const MentionList: React.FC<MentionListProps> = ({ keyword, position, onSelect, onClose }) => {
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState<string | null>(null)
	const [mentions, setMentions] = useState<App.Mention[]>([])
	const [selectedIndex, setSelectedIndex] = useState(0)
	const { getMentions } = useAIChat({})
	const locale = getLocale()
	const is_cn = locale === 'zh-CN'

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
		<div className={styles.mentionList} style={{ top: position.top, left: position.left }}>
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
							onClick={() => onSelect(mention)}
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
