import axios from 'axios'
import { injectable } from 'tsyringe'

import { catchError } from '@yaoapp/utils'

import type { Response } from '@/types'

@injectable()
export default class Index {
	@catchError()
	find<Res>(model: string, primary_value: number) {
		return axios.get<{}, Response<Res>>(`/api/xiang/table/${model}/find/${primary_value}`)
	}
}
