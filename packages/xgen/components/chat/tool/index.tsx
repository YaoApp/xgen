import { getLocale } from '@umijs/max'
import React from 'react'
import Loading from '../loading'
import styles from './index.less'
import type { Component } from '@/types'
import { Icon } from '@/widgets'
import { LogButton, openLogWindow, updateLogData, isLogWindowOpen } from '../../builder/Log'
import { LogItem, LogTabItem } from '@/components/builder/Log/types'
import { SizeHumanize, FormatDateTime } from '@/utils'

const funRe = /"function"\s*:\s*"(\w+)"/
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
	id?: string
	begin?: number
	end?: number
	text?: string
	chat_id: string
	pending?: boolean
	props?: Record<string, any>
	children?: React.ReactNode
}

interface ToolContentProps {
	id: string
	chat_id: string
	pending?: boolean
	size: string
	title: string
	logs: {
		console: LogItem[]
		output: LogItem[]
	}
}

const ToolContent = (props: ToolContentProps) => {
	const { id, chat_id, pending, size, title, logs } = props
	const is_cn = getLocale() === 'zh-CN'

	// Initial open of log window
	const handleLogClick = React.useCallback(
		(logId: string) => {
			openLogWindow(logId, {
				logs,
				title,
				tabItems: getTabItems(is_cn)
			})
		},
		[logs, title, is_cn]
	)

	const innerContent = pending ? (
		<Loading
			chat_id={chat_id}
			placeholder={is_cn ? `工具调用请求 ${size}` : `Generating Tool Call Request (${size})`}
			icon='material-slow_motion_video'
		/>
	) : (
		<div className={styles.tool}>
			<span className={styles.icon}>
				<Icon name='material-slow_motion_video' size={16} />
			</span>
			<span>{title}</span>
		</div>
	)

	return (
		<LogButton id={id} onClick={handleLogClick}>
			{innerContent}
			<Icon name='material-chevron_right' size={16} className={styles.arrowIcon} />
		</LogButton>
	)
}

const getTabItems = (is_cn: boolean): LogTabItem[] => {
	return [
		{
			key: 'console',
			label: is_cn ? '工具调用' : 'Tool Call',
			children: null
		},
		{
			key: 'output',
			label: is_cn ? '实时消息' : 'Live Messages',
			children: null
		}
	]
}

const parseLogs = (props: IProps, is_cn: boolean) => {
	const { text: text_, chat_id, pending, children, props: props_ } = props
	const text = props_?.text || text_
	const consoleLogs: LogItem[] = []
	const outputLogs: LogItem[] = []
	const begin = parseInt(props_?.begin || props?.begin || '0') / 1000 / 1000
	const end = parseInt(props_?.end || props?.end || '0') / 1000 / 1000

	let title = is_cn ? '生成工具调用' : 'Generating Tool Call'
	let content = getTextFromHtml(children) || text || (is_cn ? '生成工具调用' : 'Generating Tool Call')
	content = content
		.replace(/%7B/g, '{')
		.replace(/%7D/g, '}')
		.replace(/%22/g, '"')
		.replace(/&quot;/g, '"')

	outputLogs.push({
		datetime: FormatDateTime(end ? new Date(end) : begin ? new Date(begin) : new Date()),
		message: content,
		level: 'info'
	})

	const size = SizeHumanize(content.length)
	const match = content.match(funRe)
	if (match) {
		title = is_cn ? `生成工具调用: ${match[1]}` : `Generating Tool Call: ${match[1]}`
	}

	consoleLogs.push({
		datetime: FormatDateTime(begin ? new Date(begin) : new Date()),
		message: is_cn ? `生成工具调用请求 ${size}` : `Generating Tool Call Request (${size})`,
		level: 'info'
	})

	if (!pending) {
		consoleLogs.push({
			datetime: FormatDateTime(end ? new Date(end) : new Date()),
			message: is_cn ? `生成完毕` : `Tool Call Request Generated`,
			level: 'info'
		})
	}

	return {
		title,
		size,
		consoleLogs,
		outputLogs
	}
}

const Index = (props: IProps) => {
	const { id } = props
	const is_cn = getLocale() === 'zh-CN'

	// Memoize the parsed logs to prevent unnecessary re-renders
	const parsedData = React.useMemo(() => parseLogs(props, is_cn), [props, is_cn])
	const { title, size, consoleLogs, outputLogs } = parsedData

	// Update log window when data changes if window is open
	React.useEffect(() => {
		if (id && isLogWindowOpen(id)) {
			updateLogData(id, {
				logs: {
					console: consoleLogs,
					output: outputLogs
				},
				title,
				tabItems: getTabItems(is_cn)
			})
		}
	}, [id, consoleLogs, outputLogs, title, is_cn])

	if (!id) return null

	return (
		<ToolContent
			{...props}
			id={id}
			size={size}
			title={title}
			logs={{
				console: consoleLogs,
				output: outputLogs
			}}
		/>
	)
}

export default window.$app.memo(Index)
