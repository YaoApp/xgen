import to from 'await-to-js'

import { getTemplateValue } from './utils'

import type { Queue, QueueItem } from './types'

export default class Flow {
	raw_queue: Queue = []
	run_queue: Queue = []
	run_index = 0
	results = {} as any

	init(queue: Queue) {
		this.raw_queue = queue
		this.run_queue.push(queue[0])
		this.setRunQueue(this.run_queue)
	}

	setRunQueue(v: Queue) {
		this.run_queue = v
		this.run()
	}

	run() {
		console.log(123)

		if (!this.run_queue.length) return

		for (const item of this.run_queue) {
			this.handleTask(item)
		}
	}

	async handleTask(item: QueueItem) {
		const { task, name, payload, next, error } = item
		const [err, res] = await to(task(getTemplateValue(payload, this.results)))

		this.run_queue.shift()

		if (err) {
			if (!error) return

			const error_task = this.raw_queue.find((it) => it.name === error)

			if (!error_task) return

			this.run_queue.push(error_task)
			this.setRunQueue(this.run_queue)

			return
		}

		this.results[name] = res

		if (next) {
			const next_task = this.raw_queue.find((it) => it.name === error)

			if (!next_task) return

			this.run_queue.push(next_task)
			this.setRunQueue(this.run_queue)

			return
		}

		this.run_index += 1

		const next_task = this.raw_queue.at(this.run_index)

		if (!next_task) return

		this.run_queue.push(next_task)
		this.setRunQueue(this.run_queue)
	}
}

// 将所有Action处理成Promise异步方法，在init时push第一个/多个（支持多个并行执行）Promise进入queue，通过监听queue的变化执行 task 方法，开始执行指定任务前把该任务从queue中移除，task执行完成之后，如果执行成功，把res保存到results对象中，然后根据该任务的next & error参数来决定接下来把哪个Promise送入queue，没有next & error，执行完成，不再继续
