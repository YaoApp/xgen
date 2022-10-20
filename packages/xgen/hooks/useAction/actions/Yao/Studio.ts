import { message } from 'antd'

import { getStudio } from '@/knife'
import { studio_request } from '@/utils'

import type { OnAction } from '../../index'

export default async ({ it }: Pick<OnAction, 'it'>) => {
	const name = Object.keys(it.action)[0].replace('Studio.', '')
	const params = it.action[Object.keys(it.action)[0] as 'Studio.*']
	const { protocol, hostname } = window.location

	try {
		const res = await studio_request.post<{}, { message: string }>(
			`${protocol}//${hostname}:${getStudio().port}/service/${name}`,
			params
		)

		message.success(res?.message || 'The studio function executes success.')
	} catch (_) {}
}
