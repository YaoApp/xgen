import type { Menu } from '@/types'
import type { GlobalModel } from '@/context/app'

export interface IPropsNav {
	app_info: GlobalModel['app_info']
	user: GlobalModel['user']
	menu: Array<Menu>
	visible_nav: GlobalModel['visible_nav']
	current_nav: GlobalModel['current_nav']
	getUserMenu: () => void
	setCurrentNav: (current: GlobalModel['current_nav']) => void
}

export interface IPropsOptions {
	app_info: GlobalModel['app_info']
	user: GlobalModel['user']
	setCurrentNav: (current: GlobalModel['current_nav']) => void
	getUserMenu: () => void
}

export interface IPropsMenu {
	visible: boolean
	blocks: boolean
	title: Menu['name']
	items: Array<any>
	current_menu: GlobalModel['current_menu']
	setCurrentMenu: (current: GlobalModel['current_menu']) => void
}

export interface IPropsContainer {
	visible_nav: GlobalModel['visible_nav']
	visible_menu: GlobalModel['visible_menu']
}
