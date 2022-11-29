import { message } from 'antd'
import { findIndex } from 'lodash-es'
import { makeAutoObservable } from 'mobx'
import store from 'store2'
import { injectable } from 'tsyringe'

import { GlobalModel } from '@/context/app'
import { getPath, reg_email, reg_mobile, retryUntil } from '@/utils'
import { history } from '@umijs/max'

import Service from './services'

import type { Global, Utils } from '@/types'
import type { UserType, Captcha, ReqLogin, ResLogin, FormValues, ResAuthByLark, ReqLoginByLark } from './types'

@injectable()
export default class Model {
	user_type = '' as UserType
	captcha = {} as Captcha
	loading = {} as Global.BooleanObject
	is?: string

	constructor(public global: GlobalModel, private service: Service) {
		makeAutoObservable(this, {}, { autoBind: true })
	}

	async getCaptcha() {
		if (!window.$app.api_prefix) {
			return retryUntil(
				() => this.getCaptcha(),
				() => window.$app.api_prefix !== undefined
			)
		}

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

	async loginByLark(params: ReqLoginByLark) {
		this.loading.login = true

		const { res, err } = await this.service.loginByLark<ReqLoginByLark, ResLogin>(
			this.global.app_info?.login?.feishu?.login || '',
			params
		)

		this.afterLogin(res, err)
	}

	async afterLogin(res: ResLogin, err: Utils.ResError) {
		if (err || !res?.token) {
			this.loading.login = false
			this.getCaptcha()

			return
		}

		const entry = this.global.app_info?.login?.entry?.[this.user_type]

		if (!entry) return message.warning(this.global.locale_messages.login.no_entry)

		const current_nav = findIndex(res.menus.items, (item) => item.path === entry) || 0

		this.global.user = res.user
		this.global.menu = res.menus.items
		this.global.setting_menu = res.menus?.setting || []
		this.global.current_nav = current_nav

		if (this.global.app_info.token?.storage === 'localStorage') {
			store.local.set('token', res.token)

			if (res.studio) store.local.set('studio', res.studio)
		} else {
			store.session.set('token', res.token)

			if (res.studio) store.session.set('studio', res.studio)
		}

		store.set('user', res.user)
		store.set('menu', this.global.menu)
		store.set('setting_menu', this.global.setting_menu)
		store.set('current_nav', current_nav)
		store.set('login_url', getPath(history.location.pathname))

		await window.$app.sleep(600)

		this.loading.login = false

		history.push(entry)
	}

	onFinish(data: FormValues) {
		const { mobile, password, code } = data
		const is_email = mobile.indexOf('@') !== -1

		if (is_email) {
			if (!reg_email.test(mobile)) {
				return message.warning(this.global.locale_messages.login.form.validate.email)
			}
		} else {
			if (!reg_mobile.test(mobile)) {
				return message.warning(this.global.locale_messages.login.form.validate.mobile)
			}
		}

		this.login({
			[is_email ? 'email' : 'mobile']: mobile,
			password: password,
			captcha: {
				id: this.captcha.id,
				code
			},
			sid: store.get('temp_sid'),
			...(this.is ? { is: this.is } : {})
		})
	}
}
