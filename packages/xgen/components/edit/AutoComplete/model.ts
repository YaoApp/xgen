import { debounce } from 'lodash-es'
import { makeAutoObservable, toJS } from 'mobx'
import { injectable } from 'tsyringe'

import { Remote } from '@/models'

import type { SelectProps } from 'antd'

@injectable()
export default class Index {
	get options(): SelectProps['options'] {
		return toJS(this.remote.options)
	}

	get target_props() {
		return {}
	}

	constructor(public remote: Remote) {
		makeAutoObservable(this, {}, { autoBind: true })
	}
}
