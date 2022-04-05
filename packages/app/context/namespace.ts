import { makeAutoObservable } from 'mobx'
import { injectable } from 'tsyringe'

@injectable()
export default class Index {
	paths = [] as Array<string>

	constructor() {
		makeAutoObservable(this, {}, { autoBind: true })
	}

	get value() {
		return this.paths.join('/')
	}
}
