import axios from 'axios'
import { injectable } from 'tsyringe'

import { catchError } from '@yaoapp/utils'

import type { Response } from '@/types'

@injectable()
export default class Index {
	@catchError()
	getSetting<Res>(type: 'table' | 'form', model: string) {
		return axios.get<{}, Response<Res>>(`/api/__yao/${type}/${model}/setting`)
	}
}
