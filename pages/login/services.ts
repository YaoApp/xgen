import axios from 'axios'
import { injectable } from 'tsyringe'

import { catchError } from '@yaoapp/utils'

import type { Response } from '@/types'

@injectable()
export default class Index {
	@catchError()
	getCaptcha<Res>() {
		return axios.get<{}, Response<Res>>(`/api/xiang/user/captcha?type=digit`)
	}

	@catchError()
      login<Req, Res>(data: Req) {
		return axios.post<Req, Response<Res>>(`/api/xiang/user/login`, data)
	}

	/** autoLogin is just for demo app. */
	@catchError()
	autoLogin<Res>() {
		return axios.get<{}, Response<Res>>(`/api/demo/admin`)
	}
}
