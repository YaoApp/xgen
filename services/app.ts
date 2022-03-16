import axios from 'axios'
import { injectable } from 'tsyringe'

import { catchError } from '@yaoapp/utils'

import type { Response } from '@/types'

@injectable()
export default class Index {
	@catchError()
	getAppInfo<Res>() {
		return axios.get<{}, Response<Res>>(`/api/xiang/inspect`)
	}

	@catchError()
	getUserMenu() {
		return axios.get(`/api/xiang/user/menu`)
	}
}
