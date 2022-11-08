import axios from 'axios'
import { injectable } from 'tsyringe'

import { catchError } from '@/knife'

import type { Response } from '@/types'

@injectable()
export default class Index {
	@catchError()
	getOptions<Req, Res>(api: string, params: Req) {
		return axios.get<Req, Response<Res>>(api, { params })
	}
}
