import axios from 'axios'
import { injectable } from 'tsyringe'

import { catchError } from '@/knife'

import type { Response } from '@/types'

@injectable()
export default class Index {
	@catchError()
	getAppInfo<Res>() {
		return axios.get<{}, Response<Res>>(`/api/__yao/app/setting`)
	}

	@catchError()
	getUserMenu<Res>() {
		return axios.get<{}, Response<Res>>(
			`/api/${localStorage.getItem('__api_prefix')}/app/menu`
		)
	}
}
