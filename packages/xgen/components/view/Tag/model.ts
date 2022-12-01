import { find } from 'lodash-es'
import { makeAutoObservable } from 'mobx'
import { injectable } from 'tsyringe'

import { Remote } from '@/models'

import type { IProps } from './index'

@injectable()
export default class Index {
	props = {} as IProps

	get item() {
		return this.find()
	}

	constructor(public remote: Remote) {
		makeAutoObservable(this, {}, { autoBind: true })
	}

	find(v?: any) {
		return find(this.remote.options, (it) => it.value === (v ?? this.props.__value))
	}
}
