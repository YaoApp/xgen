import { message } from 'antd'

import type { Action } from '@/types'

export default () => {
	return (payload: Action.ShowMessage) => {
		return new Promise<void>((resolve) => {
			const { type, content } = payload

			switch (type) {
				case 'success':
					message.success(content)
					break
				case 'warning':
					message.warning(content)
					break
				case 'error':
					message.error(content)
					break
			}

			resolve()
		})
	}
}
