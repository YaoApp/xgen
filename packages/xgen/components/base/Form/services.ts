import axios from 'axios'
import { injectable } from 'tsyringe'

import { catchError } from '@/knife'

import type { Response } from '@/types'

@injectable()
export default class Index {
	@catchError()
	find<Res>(model: string, primary_value: number | string) {
		return axios.get<{}, Response<Res>>(`/api/${window.$app.api_prefix}/form/${model}/find/${primary_value}`)
	}
}
