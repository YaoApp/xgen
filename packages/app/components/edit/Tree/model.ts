import { makeAutoObservable } from 'mobx'
import { injectable } from 'tsyringe'

import { Remote } from '@/models'

import type { TreeProps } from 'antd'

@injectable()
export default class Index {
	get options(): TreeProps['treeData'] {
		return this.remote.options
	}

	constructor(public remote: Remote) {
		makeAutoObservable(this, {}, { autoBind: true })
	}
}
