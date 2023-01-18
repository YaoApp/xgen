import { makeAutoObservable } from 'mobx'
import { injectable } from 'tsyringe'

import { Remote } from '@/services'
import { decode, encode, local } from '@yaoapp/storex'

import type { Component, Global } from '@/types'

@injectable()
export default class Index {
	raw_props = {} as Global.AnyObject
	options = [] as Array<any>

	constructor(private service: Remote) {
		makeAutoObservable(this, {}, { autoBind: true })
	}

	async getOptions() {
		const remote = this.raw_props.xProps?.remote

		if (!remote) return

		const params = remote.params!
		const session_key = `${remote.api}|${new URLSearchParams(params).toString()}`

		if (local.remote_cache) {
			const session_cache: any = decode(sessionStorage.getItem(session_key))

			if (session_cache) return (this.options = session_cache)
		}

		const { res, err } = await this.service.getOptions<Component.Params, Array<any>>(remote.api, params)

		if (err) return

		if (local.remote_cache) sessionStorage.setItem(session_key, encode(res))

		this.options = res
	}

	async searchOptions(v: string) {
		const search = this.raw_props.xProps.search

		if (!search) return

		const params = {
			...search.params,
			[search.key]: v
		}

		const { res, err } = await this.service.searchOptions<Component.Params, Array<any>>(search.api, params)

		if (err) return

		this.options = res
	}

	init() {
		if (this.raw_props.options) this.options = this.raw_props.options
		if (this.raw_props.xProps?.remote) this.getOptions()
	}
}
