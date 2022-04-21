import { makeAutoObservable } from 'mobx'
import { injectable } from 'tsyringe'

import { Select } from '@/models'

import type { CascaderProps } from 'antd'

@injectable()
export default class Index {
	get options(): CascaderProps<any>['options'] {
		return this.model.options
	}

	get target_props() {
		return this.model.cascader_props
	}

	constructor(public model: Select) {
		makeAutoObservable(this, {}, { autoBind: true })
	}
}
