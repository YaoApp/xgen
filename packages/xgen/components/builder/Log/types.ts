export interface ILog {
	[key: string]: string | LogItem[]
}

export type LogLevel = 'info' | 'error' | 'warn'

export type LogItem = {
	datetime: Date
	message: string
	level: LogLevel
}

export type LogTabItem = {
	key: string
	label: string
	children?: React.ReactNode | null | undefined
}
