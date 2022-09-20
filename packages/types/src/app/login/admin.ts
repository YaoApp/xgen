import type { Type } from '@/global'

import type { Action, Entry } from './common'
import type { Layout } from './layout'

export interface Admin {
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
