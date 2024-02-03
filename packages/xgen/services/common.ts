import axios from 'axios'
import { injectable } from 'tsyringe'

import { catchError } from '@/knife'

import type { Response, BaseType } from '@/types'

@injectable()
export default class Index {
	@catchError()
	getSetting<Res>(type: BaseType, name: string, params: Record<string, any> = {}) {
		const url = `/api/${window.$app.api_prefix}/${type}/${name}/setting`
		return axios.get<{}, Response<Res>>(url, { params })
	}
}
