import type Model from './model'

export interface IPropsBreadcrumb {
	model: Model['model']
	name: Model['setting']['name']
	title: string
}

export interface Locale {
	[key: string]: {
		page: {
			title: {
				add: string
				view: string
				edit: string
			}
		}
	}
}
