import { message } from 'antd'

import { getStudio } from '@/knife'
import { studio_request } from '@/utils'

import type { Action } from '@/types'

type Args = { action: Action.ActionParams }

export default async ({ action }: Args) => {
	const name = action.type.replace('Studio.', '')
	const { protocol, hostname } = window.location

	try {
		const res = await studio_request.post<{}, { message: string }>(
			`${protocol}//${hostname}:${getStudio().port}/service/${name}`,
			action.payload
		)

		message.success(res?.message || 'The studio function executes success.')
	} catch (_) {}
}
