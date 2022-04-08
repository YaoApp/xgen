import axios from 'axios'
import { injectable } from 'tsyringe'

import { catchError } from '@yaoapp/utils'

import type { Response } from '@/types'

@injectable()
export default class Index {
	@catchError()
	getSetting<Res>(model: string) {
		return axios.get<{}, Response<Res>>(`/api/xiang/table/${model}/setting`)
	}

	@catchError()
	search<Req, Res>(model: string, params?: Req) {
		return axios.get<Req, Response<Res>>(`/api/xiang/table/${model}/search`, { params })
	}
}
