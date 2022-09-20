import { Type } from '@/global'

type Entry = Type<
	string,
	{
		'zh-CN': '配置登录后的跳转路径'
		'en-US': 'Configure the jump page after administrator login'
	}
>

type Action = {
	process: Type<
		string,
		{
			'zh-CN': '相关处理器'
			'en-US': 'Related processes'
		}
	>
	args: Type<
		string,
		{
			'zh-CN': '处理器参数'
			'en-US': 'Process args'
		}
	>
}

export interface LoginConfig {
	admin: {
		entry: Entry
	}
	user: {
		entry: Entry
		captcha: Type<
			string,
			{
				'zh-CN': '配置用户登录验证码请求的接口'
				'en-US': 'Configure the interface for user login authentication code request'
			}
		>
		login: Type<
			string,
			{
				'zh-CN': '配置用户登录请求的接口'
				'en-US': 'Configure the interface for user login request'
			}
		>
		action: Type<
			Action,
			{
				'zh-CN': '需要执行的动作'
				'en-US': 'Actions to be executed'
			}
		>
	}
	layout: {
		cover: Type<
			string,
			{
				'zh-CN': '登录页面的插画图片'
				'en-US': 'Login page cover image'
			}
		>
		slogan: Type<
			string,
			{
				'zh-CN': '登录页面的口号'
				'en-US': 'Login page slogan'
			},
			'Make Your Dream With Yao App Engine'
		>
		site: Type<
			string,
			{
				'zh-CN': '登录页面相关链接'
				'en-US': 'Login page link site'
			},
			'yaoapps.com'
		>
		showSNS: Type<
			boolean,
			{
				'zh-CN': '是否显示社交媒体图标'
				'en-US': 'Whether to show social media icons'
			}
		>
	}
}
