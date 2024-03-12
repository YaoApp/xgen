import type Model from './model'
import type { App } from '@/types'

export type UserType = 'admin' | 'user'

export interface Captcha {
	id: string
	content: string
}

export interface FormValues {
	mobile: string
	password: string
	code: string
}

export interface ReqLogin {
	email?: string
	mobile?: string
	is?: string
	sid: string
	password: string
	captcha: {
		id: string
		code: string
	}
}

export interface ResLogin {
	expires_at: number
	menus: { items: Array<App.Menu>; setting: Array<App.Menu> }
	token: string
	user: App.User
	type: UserType
	entry?: string
	sid?: string
	logout_redirect?: string | boolean
	studio?: {
		expires_at: number
		port: number
		token: string
	}
}

export interface IPropsCommon {
	type: UserType
	x: Model
}

export interface IPropsForm {
	code: Captcha['content']
	loading: boolean
	getCaptcha: () => void
	onFinish: (data: FormValues) => void
}

export interface IPropsThirdPartyLogin {
	items: App.Role['thirdPartyLogin']
}
