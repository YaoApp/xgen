import { find } from 'lodash-es'
import { makeAutoObservable } from 'mobx'
import qs from 'query-string'
import store from 'store2'
import { injectable } from 'tsyringe'

import { getDeepValue } from '@yaoapp/utils'

import Service from './services'

import type { Component } from '@/types'
import type { IProps } from './index'

@injectable()
export default class Index {
	props = {} as IProps
	options = [] as Component.Options

	get value() {
		if (!this.props.bind) return this.props.__value

		return getDeepValue(this.props.bind, this.props.__data_item)
	}

	get item() {
		return this.find()
	}

	constructor(private service: Service) {
		makeAutoObservable(this, {}, { autoBind: true })
	}

	async getOptions() {
		const remote = this.props.remote

		if (!remote) return

		const params = getDeepValue(remote.params!, this.props.__data_item)
		const is_prod = store.get('__mode') === 'production'
		const session_key = `${remote.api}|${qs.stringify(params)}`

		if (is_prod) {
			const session_cache = store.session.get(session_key)

			if (session_cache) return (this.options = session_cache)
		}

		const { res, err } = await this.service.getOptions<Component.Params, Component.Options>(
			remote.api,
			params
		)

		if (err) return

		if (is_prod) store.session.set(session_key, res)

		this.options = res
	}

	find(v?: any) {
		return find(this.options, (it) => it.value === (v ?? this.value))
	}

	init() {
		if (this.props.options) this.options = this.props.options
		if (this.props.remote) this.getOptions()
	}
}
