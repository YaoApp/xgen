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
}

export interface IPropsNav {
	avatar: GlobalModel['avatar']
	app_info: GlobalModel['app_info']
	user: GlobalModel['user']
	menu: GlobalModel['menu']
	current_nav: GlobalModel['current_nav']
	in_setting: GlobalModel['in_setting']
	setAvatar: GlobalModel['setAvatar']
	setInSetting: (v: boolean) => void
}

export interface IPropsLogo {
	logo: GlobalModel['app_info']['logo']
}

export interface IPropsItems {
	menu: GlobalModel['menu']
	current_nav: GlobalModel['current_nav']
	in_setting: GlobalModel['in_setting']
	setInSetting: IPropsNav['setInSetting']
}

export interface IPropsOptions {
	avatar: GlobalModel['avatar']
	app_info: GlobalModel['app_info']
	user: GlobalModel['user']
	in_setting: GlobalModel['in_setting']
	setAvatar: GlobalModel['setAvatar']
	setInSetting: IPropsNav['setInSetting']
}

export interface IPropsMenu {
	locale_messages: GlobalModel['locale_messages']
	title: App.Menu['name']
	items: Array<any>
	current_menu: GlobalModel['current_menu']
}

export interface IPropsContainer {}

export interface IPropsSettingModalContent {
	locale_messages: GlobalModel['locale_messages']
	locale: Locale
	theme: App.Theme
	setTheme: GlobalModel['setTheme']
}

export interface IPropsUserModalContent {
	user: IPropsOptions['user']
	locale_messages: GlobalModel['locale_messages']
	Avatar: JSX.Element
	setAvatar: GlobalModel['setAvatar']
}
