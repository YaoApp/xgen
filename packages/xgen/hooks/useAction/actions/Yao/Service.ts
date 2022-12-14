import { message } from 'antd'
import axios from 'axios'

import type { Action } from '@/types'

type Args = { action: Action.ActionParams }

export default async ({ action }: Args) => {
	const name = action.type.replace('Service.', '')

	try {
		const res = await axios.post<{}, { message: string }>(`/api/__yao/app/service/${name}`, action.payload)

		message.success(res?.message || 'The service executes success.')
	} catch (_) {}
}
