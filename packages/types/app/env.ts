import { Host, Path, Port, Type } from '@/global'

export namespace Env {
	export type YAO_LANG = Type<
		'zh-CN' | 'en-US',
		{
			'zh-CN': '命令行语言'
			'en-US': 'Cli language'
		}
	>

	export type YAO_ENV = Type<
		'development' | 'production',
		{
			'zh-CN': '运行模式'
			'en-US': 'Yao running mode'
		}
	>

	export type YAO_ROOT = Type<
		Path,
		{
			'zh-CN': '应用目录'
			'en-US': 'Application directory'
		}
	>

	export type YAO_HOST = Type<
		Host,
		{
			'zh-CN': 'Web服务域名'
			'en-US': 'Web service host'
		}
	>

	export type YAO_PORT = Type<
		Port,
		{
			'zh-CN': 'Web服务端口'
			'en-US': 'Web service port'
		}
	>

	export type YAO_LOG = Type<
		Path,
		{
			'zh-CN': '日志目录'
			'en-US': 'Log directory'
		}
	>

	export type YAO_LOG_MODE = Type<
		'TEXT' | 'JSON',
		{
			'zh-CN': '日志格式'
			'en-US': 'Log format'
		}
	>

	export type YAO_JWT_SECRET = Type<
		string,
		{
			'zh-CN': 'JWT密钥'
			'en-US': 'JWT secret key'
		}
	>

	export type YAO_SESSION_STORE = Type<
		'memory' | 'redis',
		{
			'zh-CN': '会话数据存储方式'
			'en-US': 'Session storage way'
		}
	>
}
