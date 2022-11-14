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
		this.list = [
			{
				id: '1',
				name: 'shrek',
				children: [
					{
						id: '1-1',
						name: 'shrek 1'
					},
					{
						id: '1-2',
						name: 'shrek 2'
					},
					{
						id: '1-3',
						name: 'shrek 3'
					}
				]
			},
			{
				id: '2',
				name: 'fiona',
				children: [
					{
						id: '2-1',
						name: 'fiona 1'
					},
					{
						id: '2-2',
						name: 'fiona 2'
					},
					{
						id: '2-3',
						name: 'fiona 3'
					}
				]
			}
		]
	}
}
