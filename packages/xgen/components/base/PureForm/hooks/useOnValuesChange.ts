import { useMemoizedFn } from 'ahooks'
import to from 'await-to-js'
import axios from 'axios'

import type { FormType, Global } from '@/types'
import type { IPropsPureForm } from '../types'

export default (
	onChangeHook: Required<FormType.Setting>['hooks']['onChange'],
	setData: IPropsPureForm['setData'],
	setSetting: IPropsPureForm['setSetting']
) => {
      return useMemoizedFn(async (v, isOnLoad?: boolean) => {
            if (!onChangeHook) return
            
            setData(v)

		const key = Object.keys(v)[0]
		const value = v[key]

		if (!(key in onChangeHook)) return

		const [err, res] = await to<{ data: Global.AnyObject; setting: FormType.Setting }>(
			axios.post(onChangeHook[key].api, { key, value, params: onChangeHook[key]?.params, isOnLoad })
		)

		if (err) return

		if (res.setting) setSetting(res.setting)
		if (res.data && Object.keys(res.data).length) setData(res.data)
	})
}
