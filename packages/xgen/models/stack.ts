import { remove } from 'lodash-es'
import { makeAutoObservable, toJS } from 'mobx'
import { singleton } from 'tsyringe'

import { local } from '@yaoapp/storex'

@singleton()
export default class Index {
	paths = [] as Array<string>

	constructor() {
		makeAutoObservable(this, {}, { autoBind: true })
	}

	push(path: string) {
		this.paths.push(path)
		this.sync()
	}

	pop() {
		this.paths.pop()
		this.sync()
	}

	remove(path: string) {
		remove(this.paths, (item: string) => item === path)

		this.sync()
	}

	reset() {
		this.paths = []
		this.sync()
	}

	sync() {
		local.paths = this.paths
	}

	on() {
		window.$app.Event.on('global.stack.pop', this.pop)
		window.$app.Event.on('global.stack.remove', this.remove)
	}

	off() {
		window.$app.Event.off('global.stack.pop', this.pop)
		window.$app.Event.off('global.stack.remove', this.remove)
	}
}
