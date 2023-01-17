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
		const target: SelectProps = {}

		if (this.remote.raw_props.showSearch) {
			target['filterOption'] = (input, option) =>
				String(option?.label || option?.value)
					.toLowerCase()
					.indexOf(input.toLowerCase()) >= 0
		}

		if (this.remote.raw_props.xProps?.search) {
			target['showSearch'] = true
			target['filterOption'] = false
			target['notFoundContent'] = null
			target['defaultActiveFirstOption'] = false
			target['onSearch'] = debounce(this.remote.searchOptions, 800, { leading: false })
		}

		return target
	}

	constructor(public remote: Remote) {
		makeAutoObservable(this, {}, { autoBind: true })
	}
}
