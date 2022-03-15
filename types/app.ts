import type { AxiosError } from 'axios'

export type Theme = 'light' | 'dark'

export interface Response<T> {
	res: T
	err: AxiosError['response']
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
		/** Configure the login related apis */
		apis?: {
			captcha: string
			login: string
		}
		/** Display and configure the Feishu login interface */
		feishu?: {
			authUrl: '/api/feishu/auth/url'
			login: '/api/feishu/login'
		}
	}
	optional: {
		/** Custom user model, default is xiang.user */
		userModel?: 'user'
		/** Custom menu model, default is xiang.menu */
		menuModel?: 'menu'
		/** Hide the navigation bar user function button */
		hideUserModule?: true
		/** Hide the navigation bar menu function button */
		hideMenuModule?: true
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
