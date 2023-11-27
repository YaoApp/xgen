import type Model from './model'
import type { FormType } from '@/types'

export interface IPropsBreadcrumb {
	model: Model['model']
	name: Model['setting']['name']
	title: string
}

export interface IPropsAnchor {
	sections: Model['setting']['form']['sections']
}

export interface IPropsAnchorItem {
	item: FormType.Column
}

export interface LocaleForm {
	page: {
		title: {
			add: string
			view: string
			edit: string
		}
	}
}

export interface Locale {
	[key: string]: LocaleForm
}
