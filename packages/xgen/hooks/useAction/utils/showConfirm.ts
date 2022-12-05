import { Modal } from 'antd'
import to from 'await-to-js'

import type { Action } from '@/types'

export default async (confirm: Action.Props['confirm']): Promise<boolean> => {
	const is_cn = navigator.language.indexOf('CN') !== -1

	const [_, res] = await to(
		new Promise((resolve, reject) => {
			Modal.confirm({
				title: confirm?.title,
				content: confirm?.desc,
				cancelText: is_cn ? '取消' : 'cancel',
				onOk: () => resolve(1),
				onCancel: () => reject()
			})
		})
	)

	return !!res
}
