import { getLocale } from '@umijs/max'
import React from 'react'
import Loading from '../loading'
import styles from './index.less'
import type { Component } from '@/types'
import { Icon } from '@/widgets'
import { LogButton, LogProvider } from '../../builder/Log'
import Log from '../../builder/Log'

const getTextFromHtml = (html: React.ReactNode): string => {
	if (typeof html === 'string') {
		return html
	}
	if (React.isValidElement(html)) {
		const props = html.props as { children?: React.ReactNode }
		return getTextFromHtml(props.children || '')
	}
	if (Array.isArray(html)) {
		return html.map((item) => getTextFromHtml(item)).join('')
	}
	return String(html || '')
}

interface IProps extends Component.PropsChatComponent {
	text?: string
	chat_id: string
	pending?: boolean
	props?: Record<string, any>
	children?: React.ReactNode
}

const sizeHumanize = (size: number) => {
	if (size < 1024) {
		return `${size} B`
	}
	return `${(size / 1024).toFixed(2)} KB`
}

const ToolContent = (props: IProps) => {
	const { text: text_, chat_id, pending, children, props: props_ } = props
	const is_cn = getLocale() === 'zh-CN'
	const text = props_?.text || text_
	let content = getTextFromHtml(children) || text || (is_cn ? '工具调用请求' : 'Tool call request')
	content = content
		.replace(/%7B/g, '{')
		.replace(/%7D/g, '}')
		.replace(/%22/g, '"')
		.replace(/&quot;/g, '"')

	const size = sizeHumanize(content.length)
	if (!pending) {
		// "function":"new_feature"
		// 使用正则表达式提取 function 的值,
		const function_match = content.match(/\"function\"\s*:\s*\"(\w+)\"/)
		if (function_match) {
			content = is_cn ? `工具调用请求: ${function_match[1]}` : `Tool call request: ${function_match[1]}`
		} else {
			content = is_cn ? '工具调用请求' : 'Tool call request'
		}

		// try {

		// 	const json = JSON.parse(content)
		// 	if (json.function) {
		// 		content = is_cn ? `工具调用请求: ${json.function}` : `Tool call request: ${json.function}`
		// 	}
		// } catch (error) {
		// 	console.error(content)
		// 	content = is_cn ? '工具调用请求' : 'Tool call request'
		// }
	}

	const innerContent = pending ? (
		<Loading
			chat_id={chat_id}
			placeholder={is_cn ? `工具调用请求 ${size}` : `Tool call request ${size}`}
			icon='material-slow_motion_video'
		/>
	) : (
		<div className={styles.tool}>
			<span className={styles.icon}>
				<Icon name='material-slow_motion_video' size={16} />
			</span>
			<span>{content}</span>
		</div>
	)

	return (
		<LogButton id={chat_id}>
			{innerContent}
			<Icon name='material-chevron_right' size={16} className={styles.arrowIcon} />
		</LogButton>
	)
}

const Index = (props: IProps) => {
	const is_cn = getLocale() === 'zh-CN'

	// 生成随机日志
	const generateMockLogs = () => {
		const messages = {
			info: [
				'Application started',
				'Loading configuration...',
				'Database connected successfully',
				'Cache initialized',
				'Processing request',
				'Request completed',
				'GET /api/users',
				'POST /api/data',
				'GET /api/status',
				'200 OK - Success'
			],
			warn: [
				'Memory usage above 80%',
				'High CPU usage detected',
				'Rate limit approaching',
				'Slow query detected',
				'429 Too Many Requests',
				'Cache miss rate high'
			],
			error: [
				"Failed to connect to database\nTypeError: Cannot read properties of undefined (reading 'connect')\n    at Database.connect (/src/database.ts:42:10)",
				'Internal Server Error\nError: Database query failed\nError: timeout of 5000ms exceeded\n    at QueryTimeout (/src/db/query.ts:78:23)',
				'ValidationError: Invalid request payload\n    at validatePayload (/src/validators.ts:156:12)',
				'Error: Connection refused\n    at TCPConnectWrap.afterConnect [as oncomplete] (net.js:1146:16)',
				'ReferenceError: variable is not defined\n    at processRequest (/src/middleware/validation.ts:45:8)'
			]
		}

		const getRandomMessage = (level: keyof typeof messages) => {
			const msgs = messages[level]
			return msgs[Math.floor(Math.random() * msgs.length)]
		}

		const getRandomLevel = (): 'info' | 'warn' | 'error' => {
			const weights = { info: 0.7, warn: 0.2, error: 0.1 }
			const rand = Math.random()
			if (rand < weights.info) return 'info'
			if (rand < weights.info + weights.warn) return 'warn'
			return 'error'
		}

		const generateLogEntries = (count: number) => {
			return Array.from({ length: count }, (_, i) => {
				const level = getRandomLevel()
				return {
					datetime: new Date(Date.now() - (count - i) * 1000), // 每条日志间隔1秒
					message: getRandomMessage(level),
					level: level
				}
			})
		}

		return [
			{
				id: props.chat_id,
				console: generateLogEntries(100),
				request: generateLogEntries(100),
				response: generateLogEntries(100),
				debug: generateLogEntries(100)
			}
		]
	}

	const mockLogs = generateMockLogs()

	const customTabItems = [
		{
			key: 'console',
			label: is_cn ? '控制台输出' : 'Console Output',
			children: null
		},
		{
			key: 'request',
			label: is_cn ? '请求数据' : 'Request Data',
			children: null
		},
		{
			key: 'response',
			label: is_cn ? '响应结果' : 'Response Result',
			children: null
		},
		{
			key: 'debug',
			label: is_cn ? '调试信息' : 'Debug Info',
			children: null
		}
	]

	return (
		<LogProvider>
			<ToolContent {...props} />
			<Log
				id={props.chat_id}
				logs={mockLogs}
				title={is_cn ? '工具调用请求' : 'Tool call request'}
				tabItems={customTabItems}
			/>
		</LogProvider>
	)
}

export default window.$app.memo(Index)
