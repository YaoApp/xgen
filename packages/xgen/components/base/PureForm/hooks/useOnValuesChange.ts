import { useMemoizedFn } from 'ahooks'
import to from 'await-to-js'
import axios from 'axios'

import type { FormType, Global } from '@/types'
import type { IPropsPureForm } from '../types'
import type { FormInstance } from 'antd'

export default (
	onChangeHook: Required<FormType.Setting>['hooks']['onChange'],
	setFieldsValue: FormInstance['setFieldsValue'],
	setData: IPropsPureForm['setData'],
	setSetting: IPropsPureForm['setSetting']
) => {
	return useMemoizedFn(async (v) => {
		if (!onChangeHook) return

		const key = Object.keys(v)[0]
		const value = v[key]

		if (!(key in onChangeHook)) return

		const [err, res] = await to<{ data: Global.AnyObject; setting: FormType.Setting }>(
			axios.post(onChangeHook[key].api, { key, value, params: onChangeHook[key]?.params })
		)

		if (err) return

		if (res.data && Object.keys(res.data).length) setFieldsValue(res.data)
		if (res.setting) setSetting(res.setting)

		setData(v)
	})
}
