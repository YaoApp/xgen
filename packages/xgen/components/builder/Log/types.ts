export type LogLevel = 'info' | 'warn' | 'error'

export interface LogItem {
	level: LogLevel
	message: string
	datetime: string
	type?: string // Which component to display the log
	hideDateTime?: boolean // Whether to hide the datetime
}

export interface LogTabItem {
	key: string
	label: string
	children: null
}

export interface ILog {
	[key: string]: LogItem[]
}
