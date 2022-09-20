import { Type } from '@/global'

export type Entry = Type<
	string,
	{
		'zh-CN': '配置登录后的跳转路径'
		'en-US': 'Configure the jump page after administrator login'
	}
>

export type Action = {
	process: Type<
		string,
		{
			'zh-CN': '相关处理器'
			'en-US': 'Related processes'
		}
	>
	args: Type<
		Array<string>,
		{
			'zh-CN': '处理器参数'
			'en-US': 'Process args'
		}
	>
}
