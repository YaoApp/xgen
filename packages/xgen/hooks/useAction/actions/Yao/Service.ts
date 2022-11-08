import { message } from 'antd'
import axios from 'axios'

import type { OnAction } from '../../index'

export default async ({ it }: Pick<OnAction, 'it'>) => {
	const name = Object.keys(it.action)[0].replace('Service.', '')
	const params = it.action[Object.keys(it.action)[0] as 'Service.*']

	try {
		const res = await axios.post<{}, { message: string }>(`/api/__yao/app/service/${name}`, params)

		message.success(res?.message || 'The service executes success.')
	} catch (_) {}
}
