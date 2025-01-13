import { useEffect, useRef, useState } from 'react'
import { Button, Input, Spin, Tabs } from 'antd'
import { SearchOutlined } from '@ant-design/icons'
import { history } from '@umijs/max'
import Icon from '@/widgets/Icon'
import Card from '@/layouts/components/Neo/components/AIChat/Card'
import useAIChat from '@/layouts/components/Neo/hooks/useAIChat'
import { App } from '@/types'
import styles from './index.less'

const TYPES = [
	{ key: 'all', label: 'All' },
	{ key: 'coding', label: 'Coding' },
	{ key: 'writing', label: 'Writing' },
	{ key: 'analysis', label: 'Analysis' }
]

const Index = () => {
	const [loading, setLoading] = useState(false)
	const [search, setSearch] = useState('')
	const [searchText, setSearchText] = useState('')
	const [activeType, setActiveType] = useState('all')
	const [page, setPage] = useState(1)
	const [data, setData] = useState<App.Assistant[]>([])
	const containerRef = useRef<HTMLDivElement>(null)
	const [hasMore, setHasMore] = useState(true)
	const { getAssistants } = useAIChat({})

	// Load data with pagination and filtering
	const loadData = async (reset = false) => {
		if (loading || (!hasMore && !reset)) return

		setLoading(true)
		try {
			const newPage = reset ? 1 : page
			const response = await getAssistants({
				keywords: searchText,
				page: newPage,
				pagesize: 12,
				tags: activeType !== 'all' ? [activeType] : undefined
			})

			const newData = Array.isArray(response) ? response : response?.data || []

			if (reset) {
				setData(newData)
			} else {
				setData((prevData) => [...prevData, ...newData])
			}

			setPage(newPage + 1)
			setHasMore(
				Array.isArray(response)
					? newData.length === 12
					: newData.length > 0 && newPage < (response?.pagecnt || 1)
			)
		} catch (error) {
			console.error('Failed to load assistants:', error)
		} finally {
			setLoading(false)
		}
	}

	// Handle scroll for infinite loading
	useEffect(() => {
		const container = containerRef.current
		if (!container) return

		const handleScroll = () => {
			const { scrollTop, scrollHeight, clientHeight } = container
			if (scrollHeight - scrollTop - clientHeight < 50 && !loading && hasMore) {
				loadData()
			}
		}

		container.addEventListener('scroll', handleScroll)
		return () => container.removeEventListener('scroll', handleScroll)
	}, [loading, hasMore, data])

	// Initial load and reload on filter change
	useEffect(() => {
		setData([])
		setPage(1)
		setHasMore(true)
		loadData(true)
	}, [searchText, activeType])

	const handleSearch = () => {
		setSearchText(search)
	}

	const handleKeyPress = (e: React.KeyboardEvent) => {
		if (e.key === 'Enter') {
			handleSearch()
		}
	}

	const handleCardClick = (assistant: App.Assistant) => {
		history.push(`/assistants/detail/${assistant.assistant_id}`)
	}

	const handleCreate = () => {
		history.push('/assistants/create')
	}

	return (
		<div className={styles.container}>
			<div className={styles.header}>
				<h1 className={styles.title}>AI Assistants</h1>
				<div className={styles.searchWrapper}>
					<Input
						size='large'
						prefix={<SearchOutlined />}
						placeholder='Search AI assistants...'
						value={search}
						onChange={(e) => setSearch(e.target.value)}
						onKeyPress={handleKeyPress}
						className={styles.search}
					/>
					<Button type='primary' size='large' onClick={handleSearch}>
						Search
					</Button>
				</div>
				<div className={styles.tabsWrapper}>
					<Tabs
						activeKey={activeType}
						onChange={setActiveType}
						items={TYPES.map((type) => ({ key: type.key, label: type.label }))}
					/>
					<div className={styles.createTab} onClick={handleCreate}>
						<Icon name='material-add' size={18} />
						<span>Create</span>
					</div>
				</div>
			</div>

			<div className={styles.content} ref={containerRef}>
				{loading && data.length === 0 ? (
					<div className={styles.loading}>
						<Spin size='large' />
					</div>
				) : (
					<>
						{data.length > 0 && (
							<div className={styles.grid}>
								{data.map((item) => (
									<div key={item.assistant_id} className={styles.gridItem}>
										<Card
											data={{
												...item,
												id: item.assistant_id,
												description: item.description || '',
												avatar:
													item.avatar ||
													`https://api.dicebear.com/7.x/bottts/svg?seed=${item.assistant_id}`,
												created_at:
													item.created_at ||
													new Date().toISOString(),
												readonly: item.readonly || false,
												automated: item.automated || false,
												mentionable: item.mentionable || false,
												connector: item.connector || 'Unknown',
												type: item.type || 'assistant'
											}}
											onClick={handleCardClick}
										/>
									</div>
								))}
							</div>
						)}

						{loading && data.length > 0 && (
							<div className={styles.loading}>
								<Spin />
							</div>
						)}

						{!loading && !hasMore && data.length > 0 && (
							<div className={styles.noMore}>No more data</div>
						)}

						{!loading && data.length === 0 && (
							<div className={styles.empty}>No results found</div>
						)}
					</>
				)}
			</div>
		</div>
	)
}

export default Index
