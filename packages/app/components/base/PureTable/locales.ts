import type { Locale } from './types'

export default {
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
