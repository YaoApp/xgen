import { ConfigProvider } from 'antd'
import { makeAutoObservable, reaction, toJS } from 'mobx'
import { genConfig } from 'react-nice-avatar'
import store from 'store2'
import { singleton } from 'tsyringe'

import { Stack } from '@/models'
import Service from '@/services/app'
import { getCurrentMenuIndexs } from '@/utils'

import type { AvatarFullConfig } from 'react-nice-avatar'

import type { App, LocaleMessages } from '@/types'

@singleton()
export default class GlobalModel {
	theme: App.Theme = 'light'
	avatar = {} as AvatarFullConfig
	locale_messages = {} as LocaleMessages
	app_info = {} as App.Info
	user = (store.get('user') || {}) as App.User
	menus = (store.get('menus') || { items: [], setting: {} }) as App.Menus
	menu = (store.get('menu') || []) as Array<App.Menu>
	in_setting = (store.get('in_setting') || false) as boolean
	current_nav: number = store.get('current_nav') || 0
	menu_key_path = (store.get('menu_key_path') || []) as Array<string>
	loading: boolean = false

	constructor(private service: Service, public stack: Stack) {
		makeAutoObservable(this, {}, { autoBind: true })

		const theme = (store.get('xgen-theme') || 'light') as App.Theme
		const avatar = store.get('avatar') as AvatarFullConfig

		this.reactions()
		this.getAppInfo()
		this.setTheme(theme)
		this.setAvatar(avatar)
	}

	async getAppInfo() {
		const { res, err } = await this.service.getAppInfo<App.Info>()

		if (err) return

		this.app_info = res

		window.$app.api_prefix = res.apiPrefix || '__yao'

		store.set('__mode', res.mode || 'production')
		store.set('token_storage', res.token?.storage || 'sessionStorage')
	}

	setAvatar(avatar?: AvatarFullConfig) {
		this.avatar = avatar || genConfig()

		store.set('avatar', this.avatar)
	}

	setTheme(theme: App.Theme) {
		this.theme = theme

		store.set('xgen-theme', theme)
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
		if (pathname.indexOf('/0/edit') !== -1) {
			window.$global.loading = true
		}

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

				store.set('in_setting', v)
			}
		)
		reaction(
			() => this.menu,
			(v) => store.set('menu', v)
		)
		reaction(
			() => this.current_nav,
			(v) => store.set('current_nav', v)
		)
		reaction(
			() => this.menu_key_path,
			(v) => store.set('menu_key_path', v)
		)
	}

	on() {
		window.$app.Event.on('app/updateMenuStatus', this.updateMenuStatus)
	}

	off() {
		window.$app.Event.off('app/updateMenuStatus', this.updateMenuStatus)
	}
}
