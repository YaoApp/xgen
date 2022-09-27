import { debounce } from 'lodash-es'
import { makeAutoObservable } from 'mobx'
import { injectable } from 'tsyringe'

import { Remote } from '@/models'

import type { MentionProps } from 'antd'
import type { Component } from '@/types'

@injectable()
export default class Index {
	get options(): Component.Options {
		return this.remote.options
	}

	get target_props() {
		const target: MentionProps = {}

		if (this.remote.raw_props.xProps?.search) {
			target['filterOption'] = false
			target['notFoundContent'] = null
			target['onSearch'] = debounce(this.remote.searchOptions, 800, { leading: false })
		}

		return target
	}

	constructor(public remote: Remote) {
		makeAutoObservable(this, {}, { autoBind: true })
	}
}
