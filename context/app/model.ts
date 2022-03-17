import { ConfigProvider } from 'antd'
import { makeAutoObservable } from 'mobx'
import store from 'store2'
import { singleton } from 'tsyringe'

import Service from '@/services/app'

import type { AppInfo, Theme, User, Menu, LocaleMessages } from '@/types'

@singleton()
export default class GlobalModel {
	theme: Theme = 'light'
	locale_messages = {} as LocaleMessages
	app_info = {} as AppInfo
	user = {} as User
	menu = [] as Array<Menu>
	current_nav: number = store.get('current_nav') || 0
	current_menu: number = store.get('current_menu') || 0
	visible_nav: boolean = true
	visible_menu: boolean = true
	visible_header: boolean = true

	constructor(public service: Service) {
		makeAutoObservable(this, {}, { autoBind: true })

		const theme = (store.get('xgen-theme') || 'light') as Theme

		this.setTheme(theme)
		this.getAppInfo()
	}

	setTheme(theme: Theme) {
		this.theme = theme

		store.get('xgen-theme', theme)
		document.documentElement.setAttribute('data-theme', theme)
		document.documentElement.style.colorScheme = theme

		ConfigProvider.config({
			prefixCls: 'xgen',
			theme: {
				primaryColor: theme === 'light' ? '#3371fc' : '#4e7adf'
			}
		})
	}

	async getAppInfo() {
		const { res, err } = await this.service.getAppInfo<AppInfo>()

		if (err) return

		this.app_info = res
	}
}
