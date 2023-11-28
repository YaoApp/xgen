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
	loading: boolean = false
	visible_menu: boolean = true

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
		const { res, err } = await this.service.getUserMenu<App.Menus>()
		if (err) return Promise.reject()

		this.menus = res
		this.menu = res?.items || []

		local.menus = this.menus
		local.menu = this.menu
		return Promise.resolve()
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

	updateMenuStatus(pathname: string) {
		const { hit, current_nav, paths } = getCurrentMenuIndexs(
			pathname,
			toJS(this.in_setting ? this.menus.setting : this.menus.items)
		)

		if (!hit) return

		this.current_nav = current_nav
		this.menu_key_path = paths
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
