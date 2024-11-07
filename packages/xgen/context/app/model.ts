import { ConfigProvider } from 'antd'
import { makeAutoObservable, reaction, toJS } from 'mobx'
import { genConfig } from 'react-nice-avatar'
import { singleton } from 'tsyringe'

import { sleep } from '@/knife'
import { Stack } from '@/models'
import Service from '@/services/app'
import { getCurrentMenuIndexs } from '@/utils'
import { local } from '@yaoapp/storex'

import type { AvatarFullConfig } from 'react-nice-avatar'

import type { App, LocaleMessages } from '@/types'

@singleton()
export default class GlobalModel {
	theme: App.Theme = 'light'
	avatar = {} as AvatarFullConfig
	locale_messages = {} as LocaleMessages
	app_info = {} as App.Info
	user = (local.user || {}) as App.User
	menus = (local.menus || { items: [], setting: {} }) as App.Menus
	menu = (local.menu || []) as Array<App.Menu>

	in_setting = (local.in_setting || false) as boolean
	current_nav: number = local.current_nav || 0
	menu_key_path = (local.menu_key_path || []) as Array<string>
	menu_selected_keys: Array<string> = (local.menu_key_path || []) as Array<string>
	loading: boolean = false
	visible_menu: boolean = true
	hide_nav: boolean = false

	dataCache: Record<string, any> = {}

	constructor(private service: Service, public stack: Stack) {
		makeAutoObservable(this, {}, { autoBind: true })

		const theme = (local.xgen_theme || 'light') as App.Theme
		const avatar = local.avatar as AvatarFullConfig

		this.reactions()
		this.getAppInfo()
		this.setTheme(theme)
		this.setAvatar(avatar)
	}

	async getAppInfo() {
		const { res, err } = await this.service.getAppInfo<App.Info>()

		if (err) return Promise.reject()

		this.app_info = res

		window.$app.api_prefix = res.apiPrefix || '__yao'

		local.remote_cache = res.optional?.remoteCache ?? true
		local.token_storage = res.token?.storage || 'sessionStorage'

		return Promise.resolve()
	}

	async getUserMenu() {
		console.log('getUserMenu')
		const { res, err } = await this.service.getUserMenu<App.Menus>()
		if (err) return Promise.reject()
		this.setMenus(res)
		return Promise.resolve()
	}

	setMenus(menus: App.Menus, current_nav?: number, in_setting?: boolean) {
		// Set keys for the menu items
		const setKeys = (items: Array<App.Menu>, parent_key: string, in_setting: boolean) => {
			let idxkey = 0
			items.forEach((item) => {
				const parent = parent_key != '' ? '/_parent' + parent_key : ''
				const setting = in_setting ? '/_setting' : ''
				const id = idxkey > 0 ? '/_' + idxkey : ''
				const key = `${item.path}/_menu${setting}${parent}${id}`
				item.key = key
				idxkey++
				if (item.children) setKeys(item.children, item.key, in_setting)
			})
		}

		setKeys(menus.items, '', in_setting || false)
		setKeys(menus.setting, '', true)
		this.menus = menus
		this.menu = menus?.items || []
		local.menus = this.menus
		local.menu = this.menu
		if (current_nav !== undefined) this.setCurrentNav(current_nav)
		if (in_setting !== undefined) this.setInSetting(in_setting)
	}

	setCurrentNav(current_nav: number) {
		this.current_nav = current_nav
		local.current_nav = current_nav
	}

	setInSetting(in_setting: boolean) {
		this.in_setting = in_setting
		local.in_setting = in_setting
	}

	setAvatar(avatar?: AvatarFullConfig) {
		this.avatar = avatar || genConfig()

		local.avatar = this.avatar
	}

	setTheme(theme: App.Theme) {
		this.theme = theme

		local.xgen_theme = theme
		document.documentElement.setAttribute('data-theme', theme)
		document.documentElement.style.colorScheme = theme

		ConfigProvider.config({
			prefixCls: 'xgen',
			theme: {
				primaryColor: theme === 'light' ? '#3371fc' : '#4580ff'
			}
		})
	}

	updateMenuStatus(itemkey_or_pathname: string) {
		const { hit, current_nav, paths, keys } = getCurrentMenuIndexs(
			itemkey_or_pathname,
			toJS(this.in_setting ? this.menus.setting : this.menus.items)
		)

		if (!hit) return
		this.current_nav = current_nav
		this.menu_key_path = paths
		this.menu_selected_keys = keys
	}

	reactions() {
		reaction(
			() => this.in_setting,
			(v) => {
				this.menu = v ? this.menus.setting : this.menus.items

				local.in_setting = v
			}
		)
		reaction(
			() => this.menu,
			(v) => (local.menu = v)
		)
		reaction(
			() => this.current_nav,
			(v) => (local.current_nav = v)
		)
		reaction(
			() => this.menu_key_path,
			(v) => (local.menu_key_path = v)
		)
		reaction(
			() => this.menu_selected_keys,
			(v) => (local.menu_selected_keys = v)
		)
	}

	on() {
		window.$app.Event.on('app/getAppInfo', this.getAppInfo)
		window.$app.Event.on('app/getUserMenu', this.getUserMenu)
		window.$app.Event.on('app/updateMenuStatus', this.updateMenuStatus)
	}

	off() {
		window.$app.Event.off('app/getAppInfo', this.getAppInfo)
		window.$app.Event.off('app/getUserMenu', this.getUserMenu)
		window.$app.Event.off('app/updateMenuStatus', this.updateMenuStatus)
	}
}
