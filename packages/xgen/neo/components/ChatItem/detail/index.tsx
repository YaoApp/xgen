import { isLogWindowOpen, LogItem, LogTabItem, openLogWindow, updateLogData } from '@/components/builder/Log'
import { MessageLog } from '@/neo/hooks/AIChat'
import { App } from '@/types'
import { FormatDateTime, HtmlEscape, SizeHumanize } from '@/utils'

type DetailProps = {
	id: string
	locale: string
	begin?: number
	end?: number
	text?: string
	done?: boolean
	hideDateTime?: boolean // Whether to hide the datetime
	type?: string // Which component to display the log
	[key: string]: any
}

type DetailLog = {
	title: string
	items: LogTabItem[]
	logs: Record<string, LogItem[]>
}

/**
 * Open the log window
 */
export function OpenDetail(id: string, type: App.ChatMessageType | undefined, props: DetailProps) {
	const detail_log = getDetailLog(type, props)
	openLogWindow(id, { logs: detail_log.logs, title: detail_log.title, tabItems: detail_log.items })
}

/**
 * Get the detail log
 * @param type
 * @param props
 * @returns
 */
function getDetailLog(type: App.ChatMessageType | undefined, props: DetailProps): DetailLog {
	let detail_log: DetailLog | null = null
	switch (type) {
		case 'progress':
			detail_log = parseLogsProgress(props)
			break
		case 'plan':
			detail_log = parseLogsPlan(props)
			break
		default:
			detail_log = parseLogsDefault(props)
	}
	return detail_log
}

/**
 * Update the detail, if the log window is open
 */
export function UpdateDetail(id: string, type: App.ChatMessageType | undefined, props: DetailProps) {
	if (!isLogWindowOpen(id)) return

	// Update the log window
	const detail_log = getDetailLog(type, props)
	updateLogData(id, { logs: detail_log.logs, title: detail_log.title, tabItems: detail_log.items })
}

/**
 * Parse the logs for progress
 * @param props
 * @returns
 */
function parseLogsProgress(props: DetailProps): DetailLog {
	const { title: title_props, locale, done: props_done, type, hideDateTime } = props
	const is_cn = locale === 'zh-CN'
	const logs: Record<string, LogItem[]> = { console: [], output: [] }
	const items: LogTabItem[] = [
		{
			key: 'console',
			label: is_cn ? '控制台' : 'Console',
			children: null
		},
		{
			key: 'output',
			label: is_cn ? '实时消息' : 'Live Messages',
			children: null
		}
	]

	const message_logs = (props.logs || []) as MessageLog[]
	const length = message_logs.length
	message_logs.forEach((log: MessageLog, index: number) => {
		let { title, text, begin, end, status } = log
		const is_last = index == length - 1
		if (is_last && status != 'done' && !props_done) {
			const size = SizeHumanize(text?.length || 0)
			title = `${title} (${size})`
		}
		let dt = getDateTime(begin)
		if (status == 'done' && end) {
			dt = getDateTime(end)
		}

		const datetime = FormatDateTime(dt)
		logs.console.push({ datetime, message: title, level: 'info', hideDateTime, type })
		logs.output.push({ datetime, message: text, level: 'info', hideDateTime, type })
	})
	return { title: title_props, items, logs }
}

/**
 * Parse the logs for plan
 * @param props
 * @returns
 */
function parseLogsPlan(props: DetailProps): DetailLog {
	const { title: title_props, locale, done: props_done, type, hideDateTime } = props
	const is_cn = locale === 'zh-CN'
	const logs: Record<string, LogItem[]> = { console: [], output: [] }
	const items: LogTabItem[] = [
		{
			key: 'console',
			label: is_cn ? '控制台' : 'Console',
			children: null
		},
		{
			key: 'output',
			label: is_cn ? '实时消息' : 'Live Messages',
			children: null
		}
	]

	const message_logs = (props.logs || []) as MessageLog[]
	message_logs.forEach((log: MessageLog, index: number) => {
		let { title, text, begin, end, status } = log
		if (status != 'done' && !props_done) {
			const size = SizeHumanize(text?.length || 0)
			title = `${title} (${size})`
		}

		let dt = getDateTime(begin)
		if (status == 'done' && end) {
			dt = getDateTime(end)
		}
		const datetime = FormatDateTime(dt)
		logs.console.push({ datetime, message: title, level: 'info', hideDateTime, type })
		logs.output.push({ datetime, message: text, level: 'info', hideDateTime, type })
	})
	return { title: title_props, items, logs }
}

/**
 * Parse the logs for default
 * @param id
 * @param props
 */
function parseLogsDefault(props: DetailProps): DetailLog {
	const { text, done, locale, type, hideDateTime } = props
	const begin = parseInt(`${props?.begin}` || '0') / 1000 / 1000
	const end = parseInt(`${props?.end}` || '0') / 1000 / 1000

	const is_cn = locale === 'zh-CN'
	const title = is_cn ? 'AI 消息' : 'AI Messages'
	const items: LogTabItem[] = [
		{
			key: 'console',
			label: is_cn ? '控制台' : 'Console',
			children: null
		},
		{
			key: 'output',
			label: is_cn ? '实时消息' : 'Live Messages',
			children: null
		}
	]
	const logs: Record<string, LogItem[]> = { console: [], output: [] }
	const size = SizeHumanize(text?.length || 0)
	logs.console.push({
		datetime: FormatDateTime(begin ? getDateTime(begin) : new Date()),
		message: is_cn ? `正在接收 AI 消息 (${size})` : `Receiving AI Message (${size})`,
		level: 'info',
		hideDateTime,
		type
	})

	if (done) {
		logs.console.push({
			datetime: FormatDateTime(end ? getDateTime(end) : new Date()),
			message: is_cn ? `AI 消息接收完毕` : `AI Message Received`,
			level: 'info',
			hideDateTime,
			type
		})
	}

	logs.output.push({
		datetime: FormatDateTime(end ? getDateTime(end) : begin ? getDateTime(begin) : new Date()),
		message: text || '',
		level: 'info',
		hideDateTime: true,
		type
	})

	return { title, items, logs }
}

function getDateTime(begin: number | string | undefined): Date {
	if (!begin) return new Date()

	if (typeof begin === 'number') {
		begin = `${begin}`
	}

	if (typeof begin === 'string') {
		// Handle nanosecond timestamps (16 digits) by taking first 13 digits
		if (begin.length === 16) {
			return new Date(parseInt(begin.slice(0, 13)))
		}
		// Handle microsecond timestamps (13 digits)
		else if (begin.length === 13) {
			return new Date(parseInt(begin))
		}
		return new Date(parseInt(begin))
	}
	return new Date(begin)
}
