export interface ILog {
	id: string
	console: Log[]
	request: Log[]
	response: Log[]
}

export type LogLevel = 'info' | 'error' | 'warn'

export type Log = {
	datetime: Date
	message: string
	level: LogLevel
}
