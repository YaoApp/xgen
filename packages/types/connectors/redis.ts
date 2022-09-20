import { Type } from '@/global'

import { Connector } from './common'

type Options = {
	db: Type<
		string,
		{
			'zh-CN': '数据库名称'
			'en-US': 'Database name'
		}
	>
	host: Type<
		string,
		{
			'zh-CN': '服务域名'
			'en-US': 'Redis service host'
		}
	>
	port: Type<
		string,
		{
			'zh-CN': '服务端口'
			'en-US': 'Redis service port'
		}
	>
	user: Type<
		string,
		{
			'zh-CN': '用户名'
			'en-US': 'Redis username'
		}
	>
	pass: Type<
		string,
		{
			'zh-CN': '密码'
			'en-US': 'Redis password'
		}
	>
}

export type Redis = Connector<string, 'redis', string, Options>
