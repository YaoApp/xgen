export type QueueItem = {
	task: (...args: any) => Promise<any>
	name: string
	payload: any
	next?: string
	error?: string
}

export type Queue = Array<QueueItem>
