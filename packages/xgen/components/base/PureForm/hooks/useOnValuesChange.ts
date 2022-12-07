import { useMemoizedFn } from 'ahooks'
import to from 'await-to-js'
import axios from 'axios'

import type { FormType } from '@/types'
import type { IPropsPureForm } from '../types'

export default (
	action: FormType.Setting['action'],
	setFieldsValue: (values: any) => void,
	setSetting: IPropsPureForm['setSetting']
) => {
	const hooks = action?.hooks

	return useMemoizedFn(async (v) => {
		if (!hooks) return

		const key = Object.keys(v)[0]
		const value = v[key]

		// if (!(key in hooks)) return

		const [err, res] = await to<any>(
			axios({
				url: hooks['名称'].api,
				params: { ...v, ...hooks['名称'].params }
			})
		)

		if (err) return

		if (res.data && Object.keys(res.data).length) {
			setFieldsValue(res.data)
		}

		if (res.setting && !res.setting?.code) {
			setSetting(res.setting)
		}
	})
}
