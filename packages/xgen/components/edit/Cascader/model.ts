import { makeAutoObservable } from 'mobx'
import { injectable } from 'tsyringe'

import { Remote } from '@/models'

import type { CascaderProps } from 'antd'

@injectable()
export default class Index {
	get options(): CascaderProps<any>['options'] {
		return this.remote.options
	}

	get target_props() {
		const target: CascaderProps<any> = {}

		if (this.remote.raw_props.showSearch) {
			target['showSearch'] = {
				filter: (input, path) =>
					path.some(
						(option) => String(option?.label).toLowerCase().indexOf(input.toLowerCase()) >= 0
					)
			}
		}

		return target
	}

	constructor(public remote: Remote) {
		makeAutoObservable(this, {}, { autoBind: true })
	}
}
