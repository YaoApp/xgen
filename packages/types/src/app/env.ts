import type { Host, Path, Port, Type } from '@/global'

export interface Env {
	YAO_LANG: Type<
		'zh-CN' | 'en-US',
		{
			'zh-CN': '命令行语言'
			'en-US': 'Cli language'
		}
	>
	YAO_ENV: Type<
		'development' | 'production',
		{
			'zh-CN': '运行模式'
			'en-US': 'Yao running mode'
		}
	>
	YAO_ROOT: Type<
		Path,
		{
			'zh-CN': '应用目录'
			'en-US': 'Application directory'
		}
	>
	YAO_HOST: Type<
		Host,
		{
			'zh-CN': 'Web服务域名'
			'en-US': 'Web service host'
		}
	>
	YAO_PORT: Type<
		Port,
		{
			'zh-CN': 'Web服务端口'
			'en-US': 'Web service port'
		}
	>
	YAO_LOG: Type<
		Path,
		{
			'zh-CN': '日志目录'
			'en-US': 'Log directory'
		}
	>
	YAO_LOG_MODE: Type<
		'TEXT' | 'JSON',
		{
			'zh-CN': '日志格式'
			'en-US': 'Log format'
		}
	>
	YAO_JWT_SECRET: Type<
		string,
		{
			'zh-CN': 'JWT密钥'
			'en-US': 'JWT secret key'
		}
	>
	YAO_SESSION_STORE: Type<
		'memory' | 'redis',
		{
			'zh-CN': '会话数据存储方式'
			'en-US': 'Session storage way'
		}
	>
}
