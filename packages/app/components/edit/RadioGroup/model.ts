import { makeAutoObservable } from 'mobx'
import { injectable } from 'tsyringe'

import { Remote } from '@/models'

import type { RadioGroupProps } from 'antd'

@injectable()
export default class Index {
	get options(): RadioGroupProps['options'] {
		return this.remote.options
	}

	constructor(public remote: Remote) {
		makeAutoObservable(this, {}, { autoBind: true })
	}
}
