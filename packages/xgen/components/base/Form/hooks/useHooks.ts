import { useMemo } from 'react'

import { getTemplateValue } from '@/utils'

import type { DeepRequired } from 'utility-types'
import type { FormType } from '@/types'
import type Model from '../model'

export default (
	hooks: DeepRequired<FormType.Setting>['hooks'],
	fields: FormType.Setting['fields'],
	data: Model['data']
) => {
	return useMemo(() => {
		if (!hooks) return

		const _hooks = {} as DeepRequired<FormType.Setting>['hooks']

		for (const key in hooks) {
			const _key = key as FormType.HookKeys
			const hook = hooks[_key]

			_hooks[_key] = Object.keys(hook).reduce((total, field) => {
				total[fields.form[field].bind] = hook[field]

				return total
			}, {} as FormType.HookType)
		}

		return getTemplateValue(_hooks, data)
	}, [hooks, fields, data])
}
