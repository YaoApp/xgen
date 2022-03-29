import { ConfigProvider, message } from 'antd'
import { makeAutoObservable } from 'mobx'
import { genConfig } from 'react-nice-avatar'
import store from 'store2'
import { singleton } from 'tsyringe'

import Service from '@/services/app'

import type { AvatarFullConfig } from 'react-nice-avatar'

import type { AppInfo, Theme, User, Menu, LocaleMessages } from '@/types'

@singleton()
export default class GlobalModel {
	theme: Theme = 'light'
	avatar = {} as AvatarFullConfig
	locale_messages = {} as LocaleMessages
	app_info = {} as AppInfo
	user = (store.get('user') || {}) as User
	menu = (store.get('menu') || []) as Array<Menu>
	current_nav: number = store.get('current_nav') || 0
	current_menu: number = store.get('current_menu') || 0
	visible_nav: boolean = true
	visible_menu: boolean = true
	visible_header: boolean = true

	constructor(private service: Service) {
		makeAutoObservable(this, {}, { autoBind: true })

		const theme = (store.get('xgen-theme') || 'light') as Theme
		const avatar = store.get('avatar') as AvatarFullConfig

		this.getAppInfo()
		this.setTheme(theme)
		this.setAvatar(avatar)
	}

	async getAppInfo() {
		const { res, err } = await this.service.getAppInfo<AppInfo>()

		if (err) return

		this.app_info = res
	}

	async getUserMenu() {
		const { res, err } = await this.service.getUserMenu<Array<Menu>>()

		if (err) return

		this.menu = res

		store.set('menu', res)

		message.success(this.locale_messages.layout.setting.update_menu.feedback)
	}

	setAvatar(avatar?: AvatarFullConfig) {
		this.avatar = avatar || genConfig()

		store.set('avatar', this.avatar)
	}

	setTheme(theme: Theme) {
		this.theme = theme

		store.set('xgen-theme', theme)
		document.documentElement.setAttribute('data-theme', theme)
		document.documentElement.style.colorScheme = theme

		ConfigProvider.config({
			prefixCls: 'xgen',
			theme: {
				primaryColor: theme === 'light' ? '#3371fc' : '#6a96f9'
			}
		})
	}

	toggleMenu() {
		this.visible_menu = !this.visible_menu
	}
}
