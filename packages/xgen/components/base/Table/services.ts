import axios from 'axios'
import { injectable } from 'tsyringe'

import { catchError } from '@/knife'

import type { Response } from '@/types'

@injectable()
export default class Index {
	@catchError()
	search<Req, Res>(model: string, params?: Req) {
		return axios.get<Req, Response<Res>>(`/api/${window.$app.api_prefix}/table/${model}/search`, { params })
	}

	@catchError()
	batchDelete<Res>(model: string, primary_key: string, ids: Array<number>) {
		return axios.post<{}, Response<Res>>(
			`/api/${window.$app.api_prefix}/table/${model}/delete/in?primary=${primary_key}&ids=${ids.join(',')}`
		)
	}

	@catchError()
	batchUpdate<Data, Res>(model: string, primary_key: string, ids: Array<number>, data: Data) {
		return axios.post<{}, Response<Res>>(
			`/api/${window.$app.api_prefix}/table/${model}/update/in?primary=${primary_key}&ids=${ids.join(',')}`,
			data
		)
	}
}
