import { Type } from '@/global'

import { Action, Entry } from './common'
import { Layout } from './layout'

export interface User {
	entry: Entry
	action: Type<
		Action,
		{
			'zh-CN': '需要执行的动作'
			'en-US': 'Actions to be executed'
		}
	>
	layout: Layout
}
