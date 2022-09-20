import { Type } from '@/global'

import { Connector } from './common'

type Options = {
	file: Type<
		string,
		{
			'zh-CN': '数据库文件地址'
			'en-US': 'Database file path'
		}
	>
}

export type Sqlite3 = Connector<string, 'sqlite3', string, Options>
