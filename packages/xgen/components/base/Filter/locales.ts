import type { Locale, LocaleFilter } from './types'

const locale = {
	'zh-CN': {
		search: '搜索',
		reset: '重置'
	},
	'en-US': {
		search: 'Search',
		reset: 'Reset'
	}
} as Locale

export default locale

export const Message = (key: any): LocaleFilter => {
	return locale[key] || locale['en-US']
}
