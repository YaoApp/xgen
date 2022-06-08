import axios from 'axios'
import { injectable } from 'tsyringe'

import { catchError } from '@yaoapp/utils'

import type { Response } from '@/types'

@injectable()
export default class Index {
	@catchError()
	search<Req, Res>(model: string, params?: Req) {
		return axios.get<Req, Response<Res>>(
			`/api/${localStorage.getItem('__api_prefix')}/chart/${model}/data`,
			{ params }
		)
	}
}
