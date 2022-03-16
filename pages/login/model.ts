import { message } from 'antd'
import { makeAutoObservable } from 'mobx'
import { injectable } from 'tsyringe'

import { GlobalModel } from '@/context/app'
import { reg_email, reg_mobile } from '@/utils/reg'
import { history } from '@umijs/pro'

import Service from './services'

import type { Loading } from '@/types/app'
import type { Captcha, ReqLogin, ResLogin, FormValues, UserType } from './types'

@injectable()
export default class Model {
	captcha = {} as Captcha
	user_type = '' as UserType
	loading = {} as Loading

	constructor(private global: GlobalModel, public service: Service) {
		makeAutoObservable(this, {}, { autoBind: true })

		this.getCaptcha()
	}

	onFinish(data: FormValues) {
		const { mobile, password, code } = data
		const is_email = mobile.indexOf('@') !== -1

		if (is_email) {
			if (!reg_email.test(mobile)) {
				return message.warning('格式错误')
			}
		} else {
			if (!reg_mobile.test(mobile)) {
				return message.warning('格式错误')
			}
		}

		this.login({
			[is_email ? 'email' : 'mobile']: mobile,
			password: password,
			captcha: {
				id: this.captcha.id,
				code
			}
		})
	}

	async getCaptcha() {
		const { res, err } = await this.service.getCaptcha<Captcha>()

		if (err) return

		this.captcha = res
	}

	async login(data: ReqLogin) {
		this.loading.login = true

		const { res, err } = await this.service.login<ReqLogin, ResLogin>(data)

		if (err || !res?.token) return this.getCaptcha()

		this.global.user = res.user
		this.global.menu = res.menus

		sessionStorage.setItem('token', res.token)
		localStorage.setItem('login_url', history.location.pathname)

		await window.$app.sleep(3000)

		this.loading.login = false

		const entry = this.global.app_info?.login?.entry?.[this.user_type]

		if (!entry) return message.warning('应用未设置首页，请联系管理员')

		history.push(entry)
	}
}
