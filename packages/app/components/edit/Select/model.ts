import { throttle } from 'lodash-es'
import { makeAutoObservable } from 'mobx'
import { injectable } from 'tsyringe'

import { getDeepValue } from '@yaoapp/utils'

import Service from './services'

import type { Component } from '@/types'
import type { IProps } from './index'
import type { SelectProps } from 'antd'

@injectable()
export default class Index {
	raw_props = {} as IProps
	options = [] as Component.Options

	constructor(private service: Service) {
		makeAutoObservable(this, {}, { autoBind: true })
	}

	async getOptions() {
		const remote = this.raw_props.xProps.remote

		if (!remote) return

		const { res, err } = await this.service.getOptions<Component.Params, Component.Options>(
			remote.api,
			getDeepValue(remote.params!, this.raw_props.__data_item)
		)

		if (err) return

		this.options = res
	}

	async searchOptions(v: string) {
		const search = this.raw_props.xProps.search

		if (!search) return

		const params = {
			...getDeepValue(search.params!, this.raw_props.__data_item),
			[search.key]: v
		}

		const { res, err } = await this.service.searchOptions<
			Component.Params,
			Component.Options
		>(search.api, params)

		if (err) return

		this.options = res
	}

	init() {
		if (this.raw_props.xProps.remote) this.getOptions()
	}

	get target_props(): SelectProps {
		if (!Object.keys(this.raw_props).length) return {}

		const target: SelectProps = {}

		if (this.raw_props.showSearch) {
			target['showArrow'] = false
			target['filterOption'] = (input, option) =>
				String(option?.children).toLowerCase().indexOf(input.toLowerCase()) >= 0
		}

		if (this.raw_props.xProps.search) {
			target['showArrow'] = false
			target['showSearch'] = true
			target['filterOption'] = false
			target['notFoundContent'] = null
			target['defaultActiveFirstOption'] = false
			target['onSearch'] = throttle(this.searchOptions, 800, { leading: false })
		}

		return target
	}
}
