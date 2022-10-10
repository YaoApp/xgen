import axios from 'axios'
import { injectable } from 'tsyringe'

import { catchError } from '@/knife'

import type { Response } from '@/types'

@injectable()
export default class Index {
	@catchError()
	save<Data, Res>(model: string, data: Data) {
		return axios.post<{}, Response<Res>>(`/api/${window.$app.api_prefix}/table/${model}/save`, data)
	}

	@catchError()
	delete<Res>(model: string, primary_value: number) {
		return axios.post<{}, Response<Res>>(
			`/api/${window.$app.api_prefix}/table/${model}/delete/${primary_value}`
		)
	}
}
