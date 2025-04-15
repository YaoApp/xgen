export interface ILog {
	id: string
	console: Log[]
	request: Log[]
	response: Log[]
}

export type Log = {
	datetime: Date
	message: string
}
