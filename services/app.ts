import axios from 'axios'
import { injectable } from 'tsyringe'

import { AppInfo } from '@/types/app'
import { catchError } from '@yaoapp/utils'

@injectable()
export default class Index {
	@catchError()
	getAppInfo() {
		return axios.get<AppInfo>(`/api/xiang/inspect`)
	}

	@catchError()
	getUserMenu() {
		return axios.get(`/api/xiang/user/menu`)
	}
}
