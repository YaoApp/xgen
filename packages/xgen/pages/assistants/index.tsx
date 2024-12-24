import { useEffect, useRef, useState } from 'react'
import { Button, Input, Spin, Tabs } from 'antd'
import { SearchOutlined } from '@ant-design/icons'
import { history } from '@umijs/max'
import Icon from '@/widgets/Icon'
import Card, { Assistant } from '@/layouts/components/Neo/components/AIChat/Card'
import styles from './index.less'

const TYPES = [
	{ key: 'all', label: 'All' },
	{ key: 'coding', label: 'Coding' },
	{ key: 'writing', label: 'Writing' },
	{ key: 'analysis', label: 'Analysis' }
]

// Mock data for development
const mockAssistants: Assistant[] = Array.from({ length: 50 }).map((_, index) => {
	const types = TYPES.slice(1) // Exclude 'all' from types
	const type = types[Math.floor(Math.random() * types.length)]
	const names = [
		'Code Companion',
		'Writing Expert',
		'Data Analyst',
		'Research Assistant',
		'SQL Helper',
		'Math Tutor',
		'Python Expert',
		'Document Writer',
		'Report Generator',
		'Web Developer'
	]
	const descriptions = [
		'Specialized in writing clean, efficient code with best practices. Proficient in multiple programming languages and frameworks.',
		'Expert in content creation, editing, and proofreading. Helps with articles, reports, and documentation.',
		'Skilled in data analysis, visualization, and statistical modeling. Helps interpret complex datasets.',
		'Assists with research, data collection, and analysis. Provides comprehensive insights and summaries.',
		'Database expert helping with SQL queries, database design, and optimization strategies.',
		'Helps with mathematical concepts, problem-solving, and equation analysis.',
		'Python programming specialist with expertise in various libraries and frameworks.',
		'Creates well-structured documents, technical specifications, and user guides.',
		'Generates detailed reports from data, with charts and actionable insights.',
		'Assists with web development, from frontend design to backend implementation.'
	]

	return {
		id: `${index}`,
		assistant_id: `ast_${Math.random().toString(36).substring(2, 15)}`,
		type: type.key,
		name: names[index % names.length],
		avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${index}`,
		description: descriptions[index % descriptions.length],
		connector: ['OpenAI GPT-4', 'Anthropic Claude', 'Google Gemini Pro'][Math.floor(Math.random() * 3)],
		readonly: Math.random() > 0.7,
		automated: Math.random() > 0.3,
		mentionable: true,
		created_at: new Date(Date.now() - Math.random() * 10000000000).toISOString()
	}
})

const Index = () => {
	const [loading, setLoading] = useState(false)
	const [search, setSearch] = useState('')
	const [searchText, setSearchText] = useState('')
	const [activeType, setActiveType] = useState('all')
	const [page, setPage] = useState(1)
	const [data, setData] = useState<Assistant[]>([])
	const containerRef = useRef<HTMLDivElement>(null)
	const [hasMore, setHasMore] = useState(true)

	// Load data with pagination and filtering
	const loadData = async (reset = false) => {
		if (loading || (!hasMore && !reset)) return

		setLoading(true)
		await new Promise((resolve) => setTimeout(resolve, 1000))

		const newPage = reset ? 1 : page
		const filtered = mockAssistants.filter((item) => {
			const matchSearch =
				!searchText ||
				item.name.toLowerCase().includes(searchText.toLowerCase()) ||
				item.description.toLowerCase().includes(searchText.toLowerCase())
			const matchType = activeType === 'all' || item.type === activeType
			return matchSearch && matchType
		})

		const pageSize = 12
		const start = (newPage - 1) * pageSize
		const end = start + pageSize
		const newData = filtered.slice(start, end)

		setData(reset ? newData : [...data, ...newData])
		setPage(newPage + 1)
		setHasMore(end < filtered.length)
		setLoading(false)
	}

	// Handle scroll for infinite loading
	useEffect(() => {
		const container = containerRef.current
		if (!container) return

		const handleScroll = () => {
			const { scrollTop, scrollHeight, clientHeight } = container
			if (scrollHeight - scrollTop - clientHeight < 50) {
				loadData()
			}
		}

		container.addEventListener('scroll', handleScroll)
		return () => container.removeEventListener('scroll', handleScroll)
	}, [loading, hasMore, data])

	// Initial load and reload on filter change
	useEffect(() => {
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

	const handleCardClick = (assistant: Assistant) => {
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
				<div className={styles.grid}>
					{data.map((item) => (
						<div key={item.id} className={styles.gridItem}>
							<Card data={item} onClick={handleCardClick} />
						</div>
					))}
				</div>

				{loading && (
					<div className={styles.loading}>
						<Spin />
					</div>
				)}

				{!loading && !hasMore && data.length > 0 && <div className={styles.noMore}>No more data</div>}

				{!loading && data.length === 0 && <div className={styles.empty}>No results found</div>}
			</div>
		</div>
	)
}

export default Index
