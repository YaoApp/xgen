import { useEffect, useRef, useState } from 'react'
import { Button, Input, Spin, Tabs } from 'antd'
import { SearchOutlined } from '@ant-design/icons'
import { history, getLocale } from '@umijs/max'
import Icon from '@/widgets/Icon'
import Card from '@/layouts/components/Neo/components/AIChat/Card'
import useAIChat from '@/layouts/components/Neo/hooks/useAIChat'
import { App } from '@/types'
import styles from './index.less'

// Helper function to generate default placeholder data
const generateDefaultPlaceholder = (assistant: App.Assistant, is_cn: boolean): App.ChatPlaceholder => {
	if (assistant.placeholder && Object.keys(assistant.placeholder).length > 0) {
		return assistant.placeholder
	}

	const name = assistant.name || ''
	const description = assistant.description || ''

	return {
		title: is_cn ? '新对话' : 'New Chat',
		description: description
			? is_cn
				? `你好，我是${name}，${description}`
				: `Hello, I'm ${name}, ${description}`
			: '',
		prompts: []
	}
}

const Index = () => {
	const locale = getLocale()
	const is_cn = locale === 'zh-CN'

	const [loading, setLoading] = useState(false)
	const [search, setSearch] = useState('')
	const [searchText, setSearchText] = useState('')
	const [activeType, setActiveType] = useState('all')
	const [page, setPage] = useState(1)
	const [data, setData] = useState<App.Assistant[]>([])
	const containerRef = useRef<HTMLDivElement>(null)
	const [hasMore, setHasMore] = useState(true)
	const [tags, setTags] = useState<{ key: string; label: string }[]>([
		{ key: 'all', label: is_cn ? '全部' : 'All' }
	])
	const [tagsLoading, setTagsLoading] = useState(true)

	const { getAssistants, getAssistantTags } = useAIChat({})

	// Load tags
	useEffect(() => {
		const loadTags = async () => {
			try {
				const response = await getAssistantTags()

				// Transform the string array into the required format
				let formattedTags: { key: string; label: string }[] = [
					{ key: 'all', label: is_cn ? '全部' : 'All' }
				]

				if (Array.isArray(response)) {
					// If response is an array of strings, transform each string into an object
					if (typeof response[0] === 'string') {
						const tagObjects = response.map((tag: string) => ({
							key: tag,
							label: tag
						}))
						formattedTags = [{ key: 'all', label: is_cn ? '全部' : 'All' }, ...tagObjects]
					}
					// If response is already an array of objects with key and label, use it directly
					else if (response[0] && typeof response[0] === 'object' && 'key' in response[0]) {
						formattedTags = response
					}
				}

				setTags(formattedTags)
			} catch (error) {
				console.error(is_cn ? '加载助手标签失败:' : 'Failed to load assistant tags:', error)
			} finally {
				setTagsLoading(false)
			}
		}

		loadTags()
	}, [is_cn])

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

			let newData = Array.isArray(response) ? response : response?.data || []

			// Add default placeholder for assistants that don't have one
			newData = newData.map((assistant) => {
				if (!assistant.placeholder || Object.keys(assistant.placeholder).length === 0) {
					return {
						...assistant,
						placeholder: generateDefaultPlaceholder(assistant, is_cn)
					}
				}
				return assistant
			})

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
			console.error(is_cn ? '加载助手失败:' : 'Failed to load assistants:', error)
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
		// Ensure assistant has placeholder data before redirecting
		if (!assistant.placeholder || Object.keys(assistant.placeholder).length === 0) {
			assistant.placeholder = generateDefaultPlaceholder(assistant, is_cn)
		}
		history.push(`/assistants/detail/${assistant.assistant_id}`)
	}

	const handleCreate = () => {
		history.push('/assistants/create')
	}

	return (
		<div className={styles.container}>
			<div className={styles.header}>
				<div className={styles.titleContainer}>
					<h1 className={styles.title}>{is_cn ? 'AI 助手' : 'AI Assistants'}</h1>
					<div className={styles.createIcon} onClick={handleCreate}>
						<Icon name='material-add' size={24} />
						<span className={styles.createText}>{is_cn ? '创建' : 'Create'}</span>
					</div>
				</div>
				<div className={styles.searchWrapper}>
					<Input
						size='large'
						prefix={<SearchOutlined />}
						placeholder={is_cn ? '搜索 AI 助手...' : 'Search AI assistants...'}
						value={search}
						onChange={(e) => setSearch(e.target.value)}
						onKeyPress={handleKeyPress}
						className={styles.search}
					/>
					<Button type='primary' size='large' onClick={handleSearch}>
						{is_cn ? '搜索' : 'Search'}
					</Button>
				</div>
				<div className={styles.tabsWrapper}>
					{tagsLoading ? (
						<Spin size='small' />
					) : (
						<Tabs
							activeKey={activeType}
							onChange={setActiveType}
							items={tags.map((type) => ({ key: type.key, label: type.label }))}
						/>
					)}
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
												connector:
													item.connector ||
													(is_cn ? '未知' : 'Unknown'),
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

						{!loading && data.length === 0 && (
							<div className={styles.empty}>
								{is_cn ? '未找到结果' : 'No results found'}
							</div>
						)}
					</>
				)}
			</div>
		</div>
	)
}

export default Index
