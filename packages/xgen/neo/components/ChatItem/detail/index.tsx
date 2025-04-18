import { isLogWindowOpen, LogItem, LogTabItem, openLogWindow, updateLogData } from '@/components/builder/Log'
import { App } from '@/types'
import { FormatDateTime, HtmlEscape, SizeHumanize } from '@/utils'

type DetailProps = {
	id: string
	locale: string
	begin?: number
	end?: number
	text?: string
	done?: boolean
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
	const { title, items, logs } = type == 'progress' ? parseLogsProgress(props) : parseLogsDefault(props)
	openLogWindow(id, { logs, title, tabItems: items })
}

/**
 * Update the detail, if the log window is open
 */
export function UpdateDetail(id: string, type: App.ChatMessageType | undefined, props: DetailProps) {
	if (!isLogWindowOpen(id)) return

	const { title, items, logs } = type == 'progress' ? parseLogsProgress(props) : parseLogsDefault(props)
	updateLogData(id, { logs, title, tabItems: items })
}

function parseLogsProgress(props: DetailProps): DetailLog {
	const { logs: logs_props, title: title_props, done, locale } = props
	const begin = parseInt(`${props?.begin}` || '0') / 1000 / 1000
	const end = parseInt(`${props?.end}` || '0') / 1000 / 1000
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

	const length = logs_props?.titles?.length || 0
	logs_props?.titles?.forEach((title: string, index: number) => {
		const last = index == length - 1

		logs.console.push({
			datetime: FormatDateTime(new Date(begin)),
			message: `${title} ${last ? `(${SizeHumanize(logs_props?.texts?.[index]?.length || 0)})` : ''}`,
			level: 'info'
		})
	})

	logs_props?.texts?.forEach((text: string, index: number) => {
		logs.output.push({
			datetime: FormatDateTime(new Date(begin)),
			message: HtmlEscape(text),
			level: 'info'
		})
	})

	return {
		title: title_props,
		items,
		logs
	}
}

/**
 * Parse the logs for default
 * @param id
 * @param type
 * @param props
 */
function parseLogsDefault(props: DetailProps): DetailLog {
	const { text, done, locale } = props
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
		datetime: FormatDateTime(begin ? new Date(begin) : new Date()),
		message: is_cn ? `正在接收 AI 消息 (${size})` : `Receiving AI Message (${size})`,
		level: 'info'
	})

	if (done) {
		logs.console.push({
			datetime: FormatDateTime(end ? new Date(end) : new Date()),
			message: is_cn ? `AI 消息接收完毕` : `AI Message Received`,
			level: 'info'
		})
	}

	logs.output.push({
		datetime: FormatDateTime(end ? new Date(end) : begin ? new Date(begin) : new Date()),
		message: HtmlEscape(text || ''),
		level: 'info'
	})

	return {
		title,
		items,
		logs
	}
}
