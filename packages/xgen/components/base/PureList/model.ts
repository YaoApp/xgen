import { makeAutoObservable } from 'mobx'
import { injectable } from 'tsyringe'

import { ColumnUtils, Common } from '@/services'

@injectable()
export default class Model {
	list = [] as Array<any>

	constructor(private common: Common, private column_utils: ColumnUtils) {
		makeAutoObservable(this, {}, { autoBind: true })
	}

	init(initial_value: Array<any>) {
		this.list = initial_value
	}
}
