import to from 'await-to-js'
import { isNull } from 'lodash-es'

import { getTemplateValue } from './utils'

import type { Queue, QueueItem } from './types'

export default class Flow {
	namespace = ''
	private raw_queue: Queue = []
	private run_queue: Queue = []
	private run_index = 0
	private results = {} as any

	__ORDER_LOGS__ = [] as Array<string>

	public init(namespace: string, queue: Queue) {
		this.namespace = namespace
		this.raw_queue = queue

		this.pushRunQueue(queue[0])
	}

	private pushRunQueue(item: QueueItem) {
		this.run_queue.push(item)

		this.run()
	}

	private run() {
		if (!this.run_queue.length) return

		for (const item of this.run_queue) {
			this.handleTask(item)
		}
	}

	private async handleTask(item: QueueItem) {
		const { task, name, payload, next, error } = item

		const [err, res] = await to(task(getTemplateValue(payload, this.results)))

		const task_index = this.run_queue.findIndex((it) => it.name === name)

		this.run_queue.splice(task_index, 1)

		this.__PUSH_ORDER_LOGS__(name)

		if (!isNull(err)) {
			if (!error) return this.done()

			const error_task_index = this.raw_queue.findIndex((it) => it.name === error)
			const error_task = this.raw_queue.at(error_task_index)

			if (!error_task) return this.done()

			this.pushRunQueue(error_task)

			this.run_index = error_task_index

			return
		}

		this.results[`$${name}`] = res

		if (next) {
			const next_task_index = this.raw_queue.findIndex((it) => it.name === next)
			const next_task = this.raw_queue.at(next_task_index)

			if (!next_task) return this.done()

			this.pushRunQueue(next_task)

			this.run_index = next_task_index

			return
		}

		this.run_index += 1

		const next_task = this.raw_queue.at(this.run_index)

		if (!next_task) return this.done()

		this.pushRunQueue(next_task)
	}

	done() {
		// @ts-ignore
		window.$app.Event.emit(`${this.namespace}/form/actions/done`)
	}

	private __PUSH_ORDER_LOGS__(name: string) {
		this.__ORDER_LOGS__.push(name)

		console.log(`task running order is: ${this.__ORDER_LOGS__}`)
	}
}
