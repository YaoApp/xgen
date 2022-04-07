import { Modal } from 'antd'

import type { Action } from '@/types'

export default async (tip: Action['tip']): Promise<boolean> => {
	const is_cn = navigator.language.indexOf('CN') !== -1
	let ok = false

	try {
		await new Promise((resolve, reject) => {
			Modal.confirm({
				title: tip?.title,
				content: tip?.desc,
				cancelText: is_cn ? '取消' : 'cancel',
				onOk: () => resolve(1),
				onCancel: () => reject()
			})
		})

		ok = true
	} catch (_) {
		ok = false
	}

	return ok
}
