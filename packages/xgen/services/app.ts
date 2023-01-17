import axios from 'axios'
import { nanoid } from 'nanoid/non-secure'
import { injectable } from 'tsyringe'

import { catchError } from '@/knife'
import { local } from '@yaoapp/storex'

import type { Response } from '@/types'

@injectable()
export default class Index {
	@catchError()
	getAppInfo<Res>() {
		const sid = nanoid() + new Date().valueOf()
		const lang = window.navigator.language.toLowerCase()
		const time = new Date().toLocaleString().replaceAll('/', '-')

		local.temp_sid = sid

		return axios.post<{}, Response<Res>>(`/api/__yao/app/setting`, { sid, lang, time })
	}

	@catchError()
	getUserMenu<Res>() {
		return axios.get<{}, Response<Res>>(`/api/${window.$app.api_prefix}/app/menu`)
	}
}
