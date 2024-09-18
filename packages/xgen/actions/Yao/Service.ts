import axios from 'axios'

import type { Action } from '@/types'
import { message } from 'antd'

type Args = { action: Action.ActionParams }

export default ({ action }: Args) => {
	const name = action.type.replace('Service.', '')
	return (payload: Action.YaoParams) => {
		return new Promise((resolve, reject) => {
			axios.post<{}, any>(`/api/__yao/app/service/${name}`, payload)
				.then((res) => {
					if (res.code && res.message && res.code == 200) {
						message.success(res.message)
					}
					resolve(res)
				})
				.catch((err) => reject(err))
		})
	}
}
