import { getLocale } from '@umijs/max'
import React from 'react'
import Loading from '../loading'
import styles from './index.less'
import type { Component } from '@/types'
import { Icon } from '@/widgets'
import { LogButton, LogProvider } from '../../builder/Log'
import Log from '../../builder/Log'
import { LogItem, LogTabItem } from '@/components/builder/Log/types'
import { SizeHumanize } from '@/utils'

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

const ToolContent = (props: { id: string; chat_id: string; pending?: boolean; size: string; title: string }) => {
	const { id, chat_id, pending, size, title } = props
	const is_cn = getLocale() === 'zh-CN'
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
		<LogButton id={id}>
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
	const begin = (props_?.begin && props_?.begin != 'null') || props?.begin || 0
	const end = (props_?.end && props_?.end != 'null') || props?.end || 0

	let title = is_cn ? '生成工具调用' : 'Generating Tool Call'
	let content = getTextFromHtml(children) || text || (is_cn ? '生成工具调用' : 'Generating Tool Call')
	content = content
		.replace(/%7B/g, '{')
		.replace(/%7D/g, '}')
		.replace(/%22/g, '"')
		.replace(/&quot;/g, '"')

	outputLogs.push({
		datetime: end ? new Date(end / 1000) : begin ? new Date(begin / 1000) : new Date(),
		message: content,
		level: 'info'
	})

	const size = SizeHumanize(content.length)
	const match = content.match(funRe)
	if (match) {
		title = is_cn ? `生成工具调用: ${match[1]}` : `Generating Tool Call: ${match[1]}`
	}

	consoleLogs.push({
		datetime: begin ? new Date(begin / 1000) : new Date(),
		message: is_cn ? `生成工具调用请求 ${size}` : `Generating Tool Call Request (${size})`,
		level: 'info'
	})

	if (!pending) {
		consoleLogs.push({
			datetime: end ? new Date(end / 1000) : new Date(),
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
	const { title, size, consoleLogs, outputLogs } = parseLogs(props, is_cn)
	if (!id) return null
	return (
		<LogProvider>
			<ToolContent {...props} id={id} size={size} title={title} />
			<Log
				id={id}
				logs={{ console: consoleLogs, output: outputLogs }}
				title={title}
				tabItems={getTabItems(is_cn)}
			/>
		</LogProvider>
	)
}

export default window.$app.memo(Index)
