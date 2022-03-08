import { makeAutoObservable } from 'mobx'

export default class Model {
	test = 123

	constructor() {
            makeAutoObservable(this, {}, { autoBind: true })
	}

	add() {
		this.test++
	}
}
