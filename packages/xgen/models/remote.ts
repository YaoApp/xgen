import { makeAutoObservable } from 'mobx'
import { injectable } from 'tsyringe'

import { Remote } from '@/services'
import { decode, encode, local } from '@yaoapp/storex'

import type { Component, Global } from '@/types'

@injectable()
export default class Index {
	raw_props = {} as Global.AnyObject
	options = [] as Array<any>

	static pending = {} as Record<string, boolean> // Request lock
	constructor(private service: Remote) {
		makeAutoObservable(this, {}, { autoBind: true })
	}

	async getOptions() {
		const remote = this.raw_props.xProps?.remote

		if (!remote) return

		// Cache the remote options
		const { __namespace, __bind: bind, __name: name } = this.raw_props
		const ns = __namespace || 'default'
		const params = remote.params!
		const ts = parseInt(`${new Date().getTime() / 1000}`)
		const cache_key =
			ns && bind && name ? `${ns}|${bind}|${name}|${new URLSearchParams(params).toString()}` : undefined
		const session_key = `${remote.api}|${new URLSearchParams(params).toString()}`

		if (local.remote_cache) {
			const session_cache: any = decode(sessionStorage.getItem(session_key))
			if (session_cache) return (this.options = session_cache)
		}

		if (cache_key) {
			const cache: any = decode(sessionStorage.getItem(cache_key))
			// check the cache is expired 5 seconds
			if (cache && cache.res && cache.ts && ts - cache.ts < 5) return (this.options = cache.res)
		}

		// wait for the cache to be updated
		if (cache_key && Index.pending[cache_key]) {
			setTimeout(() => this.getOptions(), 20)
			return
		}

		if (cache_key) Index.pending[cache_key] = true // lock the cache

		const { res, err } = await this.service.getOptions<Component.Params, Array<any>>(remote.api, params)
		if (err) return

		if (local.remote_cache) sessionStorage.setItem(session_key, encode(res))
		if (cache_key) sessionStorage.setItem(cache_key, encode({ res: res, ts: ts }))
		this.options = res
		if (cache_key) delete Index.pending[cache_key] // unlock the cache
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
