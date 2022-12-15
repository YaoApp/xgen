import { getStudio } from '@/knife'
import { studio_request } from '@/utils'

import type { Action } from '@/types'

type Args = { action: Action.ActionParams }

export default ({ action }: Args) => {
	const name = action.type.replace('Studio.', '')
	const { protocol, hostname } = window.location

	return (payload: Action.YaoParams) =>
		studio_request.post<{}, any>(`${protocol}//${hostname}:${getStudio().port}/service/${name}`, payload)
}
