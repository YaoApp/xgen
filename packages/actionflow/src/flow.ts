import to from 'await-to-js'
import { isNull } from 'lodash-es'

import { getTemplateValue } from './utils'

import type { Queue, QueueItem } from './types'
export default class Flow {
	raw_queue: Queue = []
	run_queue: Queue = []
	run_index = 0
	results = {} as any
	orders = [] as Array<string>

	init(queue: Queue) {
		this.raw_queue = queue

		this.pushRunQueue(queue[0])
	}

	pushRunQueue(item: QueueItem) {
		this.run_queue.push(item)

		this.run()
	}

	run() {
		if (!this.run_queue.length) return

		for (const item of this.run_queue) {
			this.handleTask(item)
		}
	}

	async handleTask(item: QueueItem) {
		const { task, name, payload, next, error } = item
		const [err, res] = await to(task(getTemplateValue(payload, this.results)))

		const task_index = this.run_queue.findIndex((it) => it.name === name)

		this.run_queue.splice(task_index, 1)
		this.orders.push(name)

		if (!isNull(err)) {
			if (!error) return console.log(123)

			const error_task = this.raw_queue.find((it) => it.name === error)

			if (!error_task) return

			this.pushRunQueue(error_task)

			return
		}

		this.results[name] = res

		if (next) {
			const next_task = this.raw_queue.find((it) => it.name === error)

			if (!next_task) return

			this.pushRunQueue(next_task)

			return
		}

		this.run_index += 1

		const next_task = this.raw_queue.at(this.run_index)

		if (!next_task) return

		this.pushRunQueue(next_task)
	}
}
