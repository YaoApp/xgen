import axios from 'axios'
import { injectable } from 'tsyringe'

import { catchError } from '@/knife'

import type { Response, BaseType } from '@/types'

@injectable()
export default class Index {
	@catchError()
	getSetting<Res>(type: BaseType, model: string) {
		return axios.get<{}, Response<Res>>(`/api/${window.$app.api_prefix}/${type}/${model}/setting`)
	}
}
