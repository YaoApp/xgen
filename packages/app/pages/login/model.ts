import { message } from 'antd'
import { makeAutoObservable } from 'mobx'
import store from 'store2'
import { injectable } from 'tsyringe'

import { GlobalModel } from '@/context/app'
import { reg_email, reg_mobile } from '@/utils/reg'
import { history } from '@umijs/max'

import Service from './services'

import type { Loading, ResError } from '@/types'
import type {
	UserType,
	Captcha,
	ReqLogin,
	ResLogin,
	FormValues,
	ResAuthByLark,
	ReqLoginByLark
} from './types'

@injectable()
export default class Model {
	user_type = '' as UserType
	captcha = {} as Captcha
	loading = {} as Loading
	is?: string

	constructor(public global: GlobalModel, private service: Service) {
		makeAutoObservable(this, {}, { autoBind: true })
	}

	async getCaptcha() {
		const { res, err } = await this.service.getCaptcha<Captcha>(
			this.user_type === 'user' ? this.global.app_info?.login?.user?.captcha : ''
		)

		if (err) return

		this.captcha = res
	}

	async login(data: ReqLogin) {
		this.loading.login = true

		const { res, err } = await this.service.login<ReqLogin, ResLogin>(
			data,
			this.user_type === 'user' ? this.global.app_info?.login?.user?.login : ''
		)

		this.afterLogin(res, err)
	}

	async authByLark() {
		const close_loading = message.loading('loading', 0)

		const { res, err } = await this.service.authByLark<ResAuthByLark>(
			this.global.app_info?.login?.feishu?.authUrl || ''
		)

		close_loading()

		if (err) return message.error(this.global.locale_messages.login.auth_lark_err)

		window.open(res.url)
	}

	async loginByLark(data: ReqLoginByLark) {
		this.loading.login = true

		const { res, err } = await this.service.loginByLark<ReqLoginByLark, ResLogin>(
			data,
			this.global.app_info?.login?.feishu?.login || ''
		)

		this.afterLogin(res, err)
	}

	async afterLogin(res: ResLogin, err: ResError) {
		if (err || !res?.token) {
			this.loading.login = false
			this.getCaptcha()

			return
		}

		this.global.user = res.user
		this.global.menu = res.menus
		this.global.current_nav = 0

		store.session.set('token', res.token)
		store.set('user', res.user)
		store.set('menu', res.menus)
		store.set('current_nav', 0)
		store.set('login_url', history.location.pathname)

		await window.$app.sleep(600)

		this.loading.login = false

		const entry = this.global.app_info?.login?.entry?.[this.user_type]

		if (!entry) return message.warning(this.global.locale_messages.login.no_entry)

		history.push(entry)
	}

	onFinish(data: FormValues) {
		const { mobile, password, code } = data
		const is_email = mobile.indexOf('@') !== -1

		if (is_email) {
			if (!reg_email.test(mobile)) {
				return message.warning(
					this.global.locale_messages.login.form.validate.email
				)
			}
		} else {
			if (!reg_mobile.test(mobile)) {
				return message.warning(
					this.global.locale_messages.login.form.validate.mobile
				)
			}
		}

		this.login({
			[is_email ? 'email' : 'mobile']: mobile,
			password: password,
			captcha: {
				id: this.captcha.id,
				code
			},
			...(this.is ? { is: this.is } : {})
		})
	}
}
