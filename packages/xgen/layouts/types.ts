import type { Locale, App } from '@/types'
import type { GlobalModel } from '@/context/app'

export interface IPropsHelmet {
	theme: GlobalModel['theme']
	app_info: GlobalModel['app_info']
}

export interface IPropsLoginWrapper {
	logo: GlobalModel['app_info']['logo']
	admin: GlobalModel['app_info']['login']['admin']
	user: GlobalModel['app_info']['login']['user']
}

export interface IPropsLoginWrapperLeft {
	logo: GlobalModel['app_info']['logo']
	layout: App.Role['layout']
}

export interface IPropsLoading {
	loading: boolean
	visible_nav: GlobalModel['visible_nav']
	visible_menu: GlobalModel['visible_menu']
}

export interface IPropsNav {
	theme: GlobalModel['theme']
	avatar: GlobalModel['avatar']
	app_info: GlobalModel['app_info']
	user: GlobalModel['user']
	menu: Array<App.Menu>
	visible_nav: GlobalModel['visible_nav']
	current_nav: GlobalModel['current_nav']
	setTheme: GlobalModel['setTheme']
	setAvatar: GlobalModel['setAvatar']
	getUserMenu: GlobalModel['getUserMenu']
}

export interface IPropsLogo {
	logo: GlobalModel['app_info']['logo']
}

export interface IPropsItems {
	menu: Array<App.Menu>
	current_nav: GlobalModel['current_nav']
}

export interface IPropsOptions {
	theme: GlobalModel['theme']
	avatar: GlobalModel['avatar']
	app_info: GlobalModel['app_info']
	user: GlobalModel['user']
	setTheme: GlobalModel['setTheme']
	setAvatar: GlobalModel['setAvatar']
	getUserMenu: GlobalModel['getUserMenu']
}

export interface IPropsMenu {
	locale_messages: GlobalModel['locale_messages']
	visible: boolean
	blocks: boolean
	title: App.Menu['name']
	items: Array<any>
	current_menu: GlobalModel['current_menu']
}

export interface IPropsContainer {
	visible_nav: GlobalModel['visible_nav']
	visible_menu: GlobalModel['visible_menu']
}

export interface IPropsSettingModalContent {
	locale_messages: GlobalModel['locale_messages']
	locale: Locale
	theme: App.Theme
	setTheme: GlobalModel['setTheme']
	getUserMenu: GlobalModel['getUserMenu']
}

export interface IPropsUserModalContent {
	user: IPropsOptions['user']
	locale_messages: GlobalModel['locale_messages']
	Avatar: JSX.Element
	setAvatar: GlobalModel['setAvatar']
}
