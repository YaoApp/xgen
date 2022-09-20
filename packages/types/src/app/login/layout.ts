import type { Type } from '@/global'

export interface Layout {
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
