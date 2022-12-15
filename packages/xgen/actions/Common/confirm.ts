import { Modal } from 'antd'

import type { Action } from '@/types'

const { confirm } = Modal

export default () => {
	return (payload: Action.Confirm) =>
		new Promise<void>((resolve, reject) => {
			confirm({
				...payload,
				onOk() {
					resolve()
				},
				onCancel() {
					reject()
				}
			})
		})
}
