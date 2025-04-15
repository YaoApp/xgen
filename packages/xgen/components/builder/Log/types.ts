export interface ILog {
	id: string
	[key: string]: string | Log[]
}

export type LogLevel = 'info' | 'error' | 'warn'

export type Log = {
	datetime: Date
	message: string
	level: LogLevel
}
