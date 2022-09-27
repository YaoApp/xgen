import { makeAutoObservable } from 'mobx'
import { injectable } from 'tsyringe'

import { Remote } from '@/models'

import type { CheckboxOptionType } from 'antd'

@injectable()
export default class Index {
	get options(): Array<CheckboxOptionType> {
		return this.remote.options
	}

	constructor(public remote: Remote) {
		makeAutoObservable(this, {}, { autoBind: true })
	}
}
