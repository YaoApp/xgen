import type { Locale, LocalePureTable } from './types'

const locale = {
	'zh-CN': {
		pagination: {
			total: {
				before: '共查询到',
				after: '条记录'
			}
		}
	},
	'en-US': {
		pagination: {
			total: {
				before: '',
				after: ' records were queried'
			}
		}
	}
} as Locale

export default locale

export const Message = (key: any): LocalePureTable => {
	return locale[key] || locale['en-US']
}
