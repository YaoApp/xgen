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

	async getOptions(selected?: any) {
		const remote = this.raw_props.xProps?.remote

		if (!remote) return

		// Cache the remote options
		const { __namespace, __bind: bind, __name: name } = this.raw_props
		const ns = __namespace || 'default'
		const params = remote.params!
		if (selected) {
			params.selected = Array.isArray(selected) ? selected : [selected]
		}

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

		const options = this.fixOptions(res)
		if (local.remote_cache) sessionStorage.setItem(session_key, encode(options))
		if (cache_key) sessionStorage.setItem(cache_key, encode({ res: options, ts: ts }))
		this.options = options
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

	// check the options is array and has {label, value} structure
	// string[] to [{label: string, value: string}]
	// {label: string, value: string}[] to [{label: string, value: string}]
	// {label: string, value: string} to [{label: string, value: string}]
	// {label: string}[] to [{label: string, value: string}]
	// {value: string} to [{label: string, value: string}]
	fixOptions(options: any) {
		const optionsFixed: { label: string; value: string; [key: string]: any }[] = []
		if (Array.isArray(options)) {
			options.forEach((option) => {
				if (typeof option === 'string') {
					optionsFixed.push({ label: option, value: option })
				} else if (Array.isArray(option)) {
					optionsFixed.push({ label: option[0], value: option[1] })
				} else if (typeof option === 'object') {
					if (option.label && option.value !== undefined) {
						optionsFixed.push(option)
					} else if (option.label) {
						optionsFixed.push({ ...option, label: option.label, value: option.label })
					} else if (option.value !== undefined) {
						optionsFixed.push({ ...option, label: option.value, value: option.value })
					}
				}
			})
			return optionsFixed
		}
		return []
	}

	init(selected?: any) {
		if (this.raw_props.options) this.options = this.fixOptions(this.raw_props.options)
		if (this.raw_props.xProps?.remote) this.getOptions(selected)
	}
}
