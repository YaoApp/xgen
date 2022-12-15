import axios from 'axios'

import type { Action } from '@/types'

type Args = { action: Action.ActionParams }

export default ({ action }: Args) => {
	const name = action.type.replace('Service.', '')

	return (payload: Action.YaoParams) => axios.post<{}, any>(`/api/__yao/app/service/${name}`, payload)
}
