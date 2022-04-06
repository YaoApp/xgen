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

	@catchError()
	save<Data, Res>(model: string, data: Data) {
		return axios.post<{}, Response<Res>>(`/api/xiang/table/${model}/save`, data)
	}

	@catchError()
	delete<Res>(model: string, primary_value: string) {
		return axios.post<{}, Response<Res>>(
			`/api/xiang/table/${model}/delete/${primary_value}`
		)
	}

	@catchError()
	batchDelete<Res>(model: string, primary_key: string, ids: Array<number>) {
		return axios.post<{}, Response<Res>>(
			`/api/xiang/table/${model}/delete/in?primary=${primary_key}&ids=${ids.join(',')}`
		)
	}

	@catchError()
	batchUpdate<Data, Res>(model: string, primary_key: string, ids: Array<number>, data: Data) {
		return axios.post<{}, Response<Res>>(
			`/api/xiang/table/${model}/update/in?primary=${primary_key}&ids=${ids.join(',')}`,
			data
		)
	}
}
