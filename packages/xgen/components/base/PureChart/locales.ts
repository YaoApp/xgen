import type { Locale, LocalePureChart } from './types'

const locale = {
	'zh-CN': {
		link_tooltip: '查看更多数据'
	},
	'en-US': {
		link_tooltip: 'Check more data'
	}
} as Locale

export default locale

export const Message = (key: any): LocalePureChart => {
	return locale[key] || locale['en-US']
}
