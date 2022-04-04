import store from 'store2'
import { singleton } from 'tsyringe'

@singleton()
export default class Index {
	paths = [] as Array<string>
	path_string = '' as string

	push(path: string) {
		this.paths.push(path)
		this.sync()
	}

	pop() {
		this.paths.pop()
		this.sync()
	}

	reset() {
		this.paths = []
		this.sync()
	}

	sync() {
		const target = this.paths.join('/')

		this.path_string = target

		store.set('path_string', target)
	}
}
