import { Type } from '@/global'

import { Connector } from './common'

type Host = {
	host: Type<
		string,
		{
			'zh-CN': '服务域名'
			'en-US': 'Msql service host'
		}
	>
	port: Type<
		string,
		{
			'zh-CN': '服务端口'
			'en-US': 'Msql service port'
		}
	>
	user: Type<
		string,
		{
			'zh-CN': '用户名'
			'en-US': 'Msql username'
		}
	>
	pass: Type<
		string,
		{
			'zh-CN': '密码'
			'en-US': 'Msql password'
		}
	>
	primary: Type<
		boolean,
		{
			'zh-CN': 'true 为主库, false为从库'
			'en-US': 'True is the master db, false is the slave db'
		}
	>
}

type Options = {
	db: Type<
		string,
		{
			'zh-CN': '数据库名称'
			'en-US': 'Database name'
		}
	>
	charset: Type<
		string,
		{
			'zh-CN': '字符集'
			'en-US': 'Database charset'
		}
	>
	collation: Type<
		string,
		{
			'zh-CN': '字符序'
			'en-US': 'Database collation'
		}
	>
	parseTime: Type<
		boolean,
		{
			'zh-CN': '是否自动解析时间'
			'en-US': 'Whether to automatically parse time'
		}
	>
	hosts: Array<Host>
}

export type Mysql = Connector<string, 'mysql', string, Options>
