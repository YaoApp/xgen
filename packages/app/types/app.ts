import type { AxiosError } from 'axios'

export type Theme = 'light' | 'dark'

export type ResError = AxiosError['response']

export interface Response<T> {
	res: T
	err: ResError
}

export interface SearchParams {
	page: number
	pagesize: number
	[key: string]: number | string
}

export interface Loading {
	[key: string]: boolean
}

export interface Match {
	type: string
	model: string
	id?: string
}

export interface AppInfo {
	/** Application Name */
	name: string
	/** Application description */
	description?: string
	login: {
		/** Configure the jump page after administrator and user login */
		entry: {
			admin: string
			user: string
		}
		/** Configure the staff login related apis */
		user?: {
			captcha: string
			login: string
		}
		/** Display and configure the Feishu login interface */
		feishu?: {
			authUrl: string
			login: string
		}
	}
	icons?: {
		png: string
	}
	optional?: {
		/** Hide the navigation bar notification */
		hideNotification?: boolean
		/** Hide the navigation bar setting */
		hideSetting?: boolean
	}
}

export interface User {
	email: string
	id: number
	mobile?: any
	name: string
	type: string
}

export interface Menu {
	id: number
	name: string
	icon: string
	path: string
	visible_menu?: boolean
	blocks?: boolean
	children?: Array<Menu>
	parent?: any
}

export interface IPropsEditComponent {
	__bind: string
	__name: string
	__data_item: any
}
