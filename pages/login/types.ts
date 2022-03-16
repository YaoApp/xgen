import type Model from './model'
import type { AppInfo, Menu, User } from '@/types/app'

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
	password: string
	captcha: {
		id: string
		code: string
	}
}

export interface ResLogin {
	expires_at: number
	menus: Array<Menu>
	token: string
	user: User
	type: UserType
}

export interface IPropsCommon {
	type: UserType
	x: Model
}

export interface IPropsForm {
	code: Captcha['content']
	feishu: AppInfo['login']['feishu']
	loading: boolean
	getCaptcha: () => void
	onFinish: (data: FormValues) => void
}
