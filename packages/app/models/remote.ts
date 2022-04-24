import { makeAutoObservable } from 'mobx'
import qs from 'query-string'
import store from 'store2'
import { injectable } from 'tsyringe'

import { Select } from '@/services'
import { getDeepValue } from '@yaoapp/utils'

import type { Component, Global } from '@/types'

@injectable()
export default class Index {
	raw_props = {} as Global.AnyObject
	options = [] as Array<any>

	constructor(private service: Select) {
		makeAutoObservable(this, {}, { autoBind: true })
	}

	async getOptions() {
		const remote = this.raw_props.xProps?.remote

		if (!remote) return

		const params = getDeepValue(remote.params!, this.raw_props.__data_item)
		const is_prod = store.get('__mode') === 'production'
		const session_key = `${remote.api}|${qs.stringify(params)}`

		if (is_prod) {
			const session_cache = store.session.get(session_key)

			if (session_cache) return (this.options = session_cache)
		}

		const { res, err } = await this.service.getOptions<Component.Params, Array<any>>(
			remote.api,
			params
		)

		if (err) return

		if (is_prod) store.session.set(session_key, res)

		this.options = res
	}

	async searchOptions(v: string) {
		const search = this.raw_props.xProps.search

		if (!search) return

		const params = {
			...getDeepValue(search.params!, this.raw_props.__data_item),
			[search.key]: v
		}

		const { res, err } = await this.service.searchOptions<Component.Params, Array<any>>(
			search.api,
			params
		)

		if (err) return

		this.options = res
	}

      init() {
		if (this.raw_props.options) this.options = this.raw_props.options
		if (this.raw_props.xProps?.remote) this.getOptions()
	}
}
