import { findLastIndex } from 'lodash-es'
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

	remove(path: string) {
		const index = findLastIndex(this.paths, (item: string) => item === path)

		this.paths.slice(index + 1)
		this.sync()
	}

	reset() {
		this.paths = []
		this.sync()
	}

	sync() {
		store.set('__paths', this.paths)
	}
}
