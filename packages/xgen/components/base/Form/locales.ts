import type { Locale, LocaleForm } from './types'

const locale = {
	'zh-CN': {
		page: {
			title: {
				add: '新增',
				view: '查看',
				edit: '编辑'
			}
		}
	},
	'en-US': {
		page: {
			title: {
				add: 'Add ',
				view: 'View ',
				edit: 'Edit '
			}
		}
	}
} as Locale

export default locale

export const Message = (key: any): LocaleForm => {
	return locale[key] || locale['en-US']
}
