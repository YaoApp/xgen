import { Type } from '@/global'

type ConnectorType = 'mysql' | 'sqlite3' | 'mongo' | 'redis'

export type Connector<Label, T extends ConnectorType, Version, Options> = {
	label: Type<
		Label,
		{
			'zh-CN': '连接器名称'
			'en-US': 'Connector name'
		}
	>
	type: Type<
		T,
		{
			'zh-CN': '数据库类型'
			'en-US': 'Database type'
		}
	>
	version: Type<
		Version,
		{
			'zh-CN': '数据库版本'
			'en-US': 'Database version'
		}
	>
	options: Options
}
