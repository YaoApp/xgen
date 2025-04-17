export type LogLevel = 'info' | 'warn' | 'error'

export interface LogItem {
	level: LogLevel
	message: string
	datetime: string
}

export interface LogTabItem {
	key: string
	label: string
	children: null
}

export interface ILog {
	[key: string]: LogItem[]
}
